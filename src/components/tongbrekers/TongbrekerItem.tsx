import type { Tongbreker } from '../../types';
import { useTTS } from '../../hooks/useTTS';
import { useTongbrekerShare } from '../../hooks/useTongbrekerShare';
import { useState } from 'react';

interface TongbrekerItemProps {
  tongbreker: Tongbreker;
  onDelete: (id: string) => void;
}

export const TongbrekerItem = ({ tongbreker, onDelete }: TongbrekerItemProps) => {
  const { speak, currentId, isSupported: ttsSupported } = useTTS();
  const { share, isSupported: shareSupported } = useTongbrekerShare();
  const [notification, setNotification] = useState('');

  const isPlaying = currentId === tongbreker.id;

  const handlePlay = async () => {
    try {
      await speak(tongbreker.text, tongbreker.id);
    } catch (error) {
      console.error('TTS error:', error);
      showNotification('❌ Audio afspelen mislukt');
    }
  };

  const handleShare = async () => {
    const result = await share(tongbreker);
    if (result.success) {
      if (result.method === 'copy') {
        showNotification('📋 Gekopieerd naar klembord!');
      }
    } else {
      showNotification('❌ Delen mislukt');
    }
  };

  const handleDelete = () => {
    onDelete(tongbreker.id);
    showNotification('🗑️ Verwijderd');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Zojuist';
    if (minutes < 60) return `${minutes}m geleden`;
    if (hours < 24) return `${hours}u geleden`;
    if (days < 7) return `${days}d geleden`;

    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="bg-red-950 border-2 border-red-700 rounded-xl p-6 shadow-2xl hover:border-orange-500 hover:-translate-y-1 transition-all duration-300 animate-slide-in relative">
      <p className="text-white text-lg leading-relaxed mb-4 font-semibold">
        {tongbreker.text}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-red-400 text-sm">{formatDate(tongbreker.created_at)}</span>
        <div className="flex gap-2">
          <button
            onClick={handlePlay}
            disabled={!ttsSupported}
            className={`
              px-4 py-2 text-2xl rounded-lg border-2 border-red-600
              bg-red-900 hover:bg-red-800 hover:border-orange-500
              transition-all duration-200 hover:scale-110 active:scale-95
              ${!ttsSupported ? 'opacity-40 cursor-not-allowed' : ''}
            `}
            title={ttsSupported ? 'Speel af' : 'TTS niet ondersteund'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-red-600 bg-red-900 hover:bg-red-800 hover:border-orange-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title={shareSupported ? 'Delen' : 'Kopieer'}
          >
            {shareSupported ? '📤' : '📋'}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-2xl rounded-lg border-2 border-red-600 bg-red-900 hover:bg-red-800 hover:border-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Verwijder"
          >
            🗑️
          </button>
        </div>
      </div>

      {notification && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-orange-500 text-black px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap animate-slide-in z-10">
          {notification}
        </div>
      )}
    </div>
  );
};

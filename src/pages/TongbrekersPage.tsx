import { useState, useEffect } from 'react';
import type { Tongbreker } from '../types';
import { generateId } from '../utils/storage';
import { tongbrekerService } from '../services/tongbreker';
import { tongbrekerStorage } from '../utils/tongbrekerStorage';
import { getTongbrekerFromUrl } from '../utils/tongbrekerUrl';
import { Notification } from '../components/Notification';
import { TongbrekerList } from '../components/tongbrekers/TongbrekerList';

export const TongbrekersPage = () => {
  const [tongbrekers, setTongbrekers] = useState<Tongbreker[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  // Load tongbrekers from localStorage on mount
  useEffect(() => {
    const loadedTongbrekers = tongbrekerStorage.getTongbrekers();
    setTongbrekers(loadedTongbrekers);

    const loadedApiKey = tongbrekerStorage.getApiKey();
    setApiKey(loadedApiKey);

    // Check for shared tongbreker in URL
    const sharedTongbreker = getTongbrekerFromUrl();
    if (sharedTongbreker) {
      const exists = loadedTongbrekers.some((t) => t.text === sharedTongbreker.text);
      if (!exists) {
        tongbrekerStorage.saveTongbreker(sharedTongbreker);
        setTongbrekers((prev) => [sharedTongbreker, ...prev]);
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      showNotification('Gedeelde tongbreker geladen! 🔥', 'success');
    }
  }, []);

  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    tongbrekerStorage.saveApiKey(key);
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen! 🔑', 'success');
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist! Voer je Gemini key in.', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const text = await tongbrekerService.generateTongbreker(activeApiKey);

      const tongbreker: Tongbreker = {
        id: generateId(),
        text,
        created_at: new Date().toISOString(),
      };

      tongbrekerStorage.saveTongbreker(tongbreker);
      setTongbrekers((prev) => [tongbreker, ...prev]);
      showNotification('Nieuwe tongbreker gegenereerd! 🔥', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);

      if (error.message?.includes('Te veel requests') || error.message?.includes('429')) {
        setShowApiKeyInput(true);
        showNotification('Rate limited! Voer een andere API key in.', 'error');
      } else {
        showNotification(error.message || 'Er ging iets mis... 😬', 'error');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    tongbrekerStorage.deleteTongbreker(id);
    setTongbrekers((prev) => prev.filter((t) => t.id !== id));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-orange-900">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 mb-4 drop-shadow-lg">
            🔥 TERING TONGBREKERS 🔥
          </h1>
          <p className="text-xl text-red-200 font-semibold">
            Extreem moeilijke, absurd humoristische Nederlandse tongbrekers
          </p>
          <p className="text-red-300 mt-2 italic">
            Genereer onuitspreekbare kunstwerken met AI
          </p>
        </header>

        <main>
          {/* Generate Button */}
          <div className="mb-12 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative px-12 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-black text-xl rounded-xl hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all shadow-2xl border-4 border-red-400"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block animate-spin mr-2">🔥</span>
                  GENEREREN...
                </>
              ) : (
                <>
                  🎯 GENEREER TONGBREKER
                </>
              )}
            </button>
          </div>

          {/* API Key Input */}
          {showApiKeyInput && (
            <div className="mb-12 bg-red-950 border-2 border-red-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">🔑 API Key vereist</h3>
              <p className="text-red-200 mb-4 text-sm">
                Voer je Google Gemini API key in om tongbrekers te kunnen genereren.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIza..."
                  className="flex-1 px-4 py-3 bg-red-900 border-2 border-red-600 rounded-lg text-white placeholder-red-400 focus:outline-none focus:border-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const input = e.currentTarget;
                      if (input.value.trim()) {
                        handleSaveApiKey(input.value.trim());
                      }
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSaveApiKey(input.value.trim());
                    }
                  }}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-red-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gradient-to-br from-red-950 via-red-900 to-orange-900 px-4 text-red-300 font-bold uppercase tracking-wider text-sm">
                Recente Tongbrekers
              </span>
            </div>
          </div>

          {/* Tongbrekers List */}
          <section>
            <TongbrekerList tongbrekers={tongbrekers} onDelete={handleDelete} />
          </section>
        </main>

        <footer className="text-center mt-16 pt-8 border-t-2 border-red-800">
          <p className="text-red-400 text-sm">
            © {new Date().getFullYear()} • Tering Tongbrekers • Aangedreven door AI • Struikel op eigen risico
          </p>
        </footer>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

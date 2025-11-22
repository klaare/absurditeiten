import { useState } from 'react';
import type { Tongbreker } from './types';
import { generateId } from './utils/storage';
import { geminiService } from './services/gemini';
import { ApiKeyInput } from './components/ApiKeyInput';
import { GenerateButton } from './components/GenerateButton';
import { TongbrekerList } from './components/TongbrekerList';
import { Notification } from './components/Notification';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [tongbrekers, setTongbrekers] = useLocalStorage<Tongbreker[]>(
    'tering_tongbrekers_history',
    []
  );
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showApiKeyInput = !apiKey;

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    showNotification('API key opgeslagen! 🎉', 'success');
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      showNotification('API key vereist!', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const text = await geminiService.generateTongbreker(apiKey);

      const tongbreker: Tongbreker = {
        id: generateId(),
        text,
        created_at: new Date().toISOString(),
      };

      setTongbrekers((prev) => [tongbreker, ...prev].slice(0, 50));
      showNotification('Tongbreker gegenereerd! 🔥', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);
      showNotification(error.message || 'AI struikelde over zijn eigen tong...', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-2 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            🔥 Tering Tongbrekers 🔥
          </h1>
          <p className="text-gray-400 uppercase tracking-widest text-sm">
            AI-gedreven tongbreker chaos
          </p>
        </header>

        {/* Main Content */}
        <main>
          {/* Generate Section */}
          <div className="mb-12">
            <GenerateButton onClick={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* API Key Input */}
          {showApiKeyInput && <ApiKeyInput onSave={handleSaveApiKey} />}

          {/* Recent Tongbrekers */}
          <section>
            <h2 className="text-center text-gray-400 tracking-[0.3em] font-semibold mb-6">
              — RECENT —
            </h2>
            <TongbrekerList tongbrekers={tongbrekers} />
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-background-surface">
          <p className="text-gray-500 text-sm">Gemaakt met 🤖 Gemini AI</p>
        </footer>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default App;

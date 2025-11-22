import { useState, useEffect } from 'react';
import type { Condoleance } from './types';
import { generateId } from './utils/storage';
import { geminiService } from './services/gemini';
import { ApiKeyInput } from './components/ApiKeyInput';
import { GenerateButton } from './components/GenerateButton';
import { CondoleanceList } from './components/CondoleanceList';
import { Notification } from './components/Notification';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getCondoleanceFromUrl, clearUrlParams } from './utils/url';

function App() {
  const [condoleances, setCondoleances] = useLocalStorage<Condoleance[]>(
    'curieuze_condoleances_history',
    []
  );
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini_api_key', null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Get API key from environment or localStorage
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeApiKey = apiKey || envApiKey;

  // Check for shared condoleance in URL on mount
  useEffect(() => {
    const sharedCondoleance = getCondoleanceFromUrl();
    if (sharedCondoleance) {
      // Add to the beginning of the list
      setCondoleances((prev) => {
        // Check if it's already in the list (avoid duplicates)
        const exists = prev.some((t) => t.text === sharedCondoleance.text);
        if (exists) {
          return prev;
        }
        return [sharedCondoleance, ...prev].slice(0, 50);
      });
      // Clear URL params for clean URL
      clearUrlParams();
      showNotification('Gedeelde condoleance geladen', 'success');
    }
  }, []);

  // Only show API key input if no key is available (env or localStorage)
  useEffect(() => {
    setShowApiKeyInput(!activeApiKey);
  }, [activeApiKey]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    setShowApiKeyInput(false);
    showNotification('API key opgeslagen', 'success');
  };

  const handleGenerate = async () => {
    if (!activeApiKey) {
      setShowApiKeyInput(true);
      showNotification('API key vereist', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      const text = await geminiService.generateCondoleance(activeApiKey);

      const condoleance: Condoleance = {
        id: generateId(),
        text,
        created_at: new Date().toISOString(),
      };

      setCondoleances((prev) => [condoleance, ...prev].slice(0, 50));
      showNotification('Nieuwe condoleance gegenereerd', 'success');
    } catch (error: any) {
      console.error('Generation error:', error);

      // Show API key input on rate limit error
      if (error.message?.includes('Te veel requests') || error.message?.includes('429')) {
        setShowApiKeyInput(true);
        showNotification('Rate limited! Voer een andere API key in.', 'error');
      } else {
        showNotification(error.message || 'Er ging iets mis...', 'error');
      }
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
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Newspaper Header */}
        <header className="text-center mb-12 border-b-4 border-double border-ink pb-8">
          <div className="mb-4">
            <div className="text-xs tracking-widest text-ink-faded uppercase mb-2">
              Sinds 2024
            </div>
            <h1 className="font-headline text-5xl md:text-7xl text-ink mb-2 leading-tight">
              Curieuze Condoleances
            </h1>
            <div className="flex items-center justify-center gap-4 text-xs text-ink-faded uppercase tracking-widest">
              <span>•</span>
              <span>In Memoriam</span>
              <span>•</span>
              <span>Satirisch Rouwregister</span>
              <span>•</span>
            </div>
          </div>
          <p className="text-sm text-ink-light italic max-w-2xl mx-auto leading-relaxed">
            "Voor wanneer woorden tekortschieten... of compleet de plank misslaan"
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

          {/* Ornamental Divider */}
          <div className="ornamental-divider my-12">
            <span className="bg-paper px-4 text-xs tracking-widest text-ink-faded uppercase">
              Rouwadvertenties
            </span>
          </div>

          {/* Recent Condoleances */}
          <section>
            <CondoleanceList condoleances={condoleances} />
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t-2 border-ink-light">
          <p className="text-xs text-ink-faded tracking-wide">
            © {new Date().getFullYear()} • Curieuze Condoleances • Satirische uitgave • Niet bedoeld voor daadwerkelijk gebruik
          </p>
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

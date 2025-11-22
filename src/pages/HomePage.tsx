import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-dark via-paper to-paper-aged">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="font-headline text-6xl md:text-8xl text-ink mb-4">
            AI Absurditeiten
          </h1>
          <p className="text-xl text-ink-light italic">
            Waar kunstmatige intelligentie natuurlijke gekheid genereert
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tongbrekers Card */}
          <Link
            to="/tongbrekers"
            className="group bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-lg border-4 border-red-800 hover:border-red-600 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Tering Tongbrekers
            </h2>
            <p className="text-red-100 mb-4">
              Extreem moeilijke, absurd humoristische Nederlandse tongbrekers die je spraak tot struikelpartij maken.
            </p>
            <div className="text-red-300 text-sm italic">
              "De trillende trompetterende trol trapte twaalf tintelende turnsters..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer tongbreker →
            </div>
          </Link>

          {/* Condoleances Card */}
          <Link
            to="/condoleances"
            className="group bg-paper-aged p-8 rounded-lg border-4 border-ink hover:border-accent transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🕊️</div>
            <h2 className="text-3xl font-bold text-ink mb-3">
              Curieuze Condoleances
            </h2>
            <p className="text-ink-light mb-4">
              Satirische rouwadvertenties die opzettelijk de plank misslaan met ongemakkelijke, absurde condoleances.
            </p>
            <div className="text-ink-faded text-sm italic">
              "Met verslagenheid vernamen wij het heengaan van uw geliefde cactus..."
            </div>
            <div className="mt-6 text-ink font-bold group-hover:translate-x-2 transition-transform">
              Genereer condoleance →
            </div>
          </Link>
        </div>

        <footer className="text-center mt-20 text-ink-faded text-sm">
          <p>Aangedreven door Google Gemini AI • Voor humoristische doeleinden</p>
        </footer>
      </div>
    </div>
  );
};

export const SpreukenPage = () => {
  const spreukenAppUrl = import.meta.env.VITE_SPREUKEN_APP_URL || 'http://localhost:3000';

  return (
    <div className="h-screen flex flex-col">
      {/* Iframe takes full screen minus navbar */}
      <iframe
        src={spreukenAppUrl}
        title="Onwijsheden Tegels App"
        className="w-full flex-1 border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  );
};

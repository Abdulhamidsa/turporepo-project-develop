import { Button } from "@repo/ui/components/ui/button";

const NotFound = ({ homeLink = "/", buttonText = "Go Home" }) => {
  const handleGoHome = () => {
    window.location.href = homeLink;
  };

  return (
    <div className="flex flex-col h-dvh inset-0 z-50 items-center justify-center min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] p-4" aria-label="404 Page Not Found">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl mb-4 font-bold tracking-tighter sm:text-5xl animate-bounce">404</h1>
        <p className="text-2xl md:text-3xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      </div>
      <Button
        onClick={handleGoHome}
        className="bg-[var(--primary-color)] text-[var(--text-color)] hover:bg-[var(--primary-color-hover)] px-8 py-3 text-lg font-semibold rounded-lg shadow-md transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
        aria-label="Go to Home"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default NotFound;

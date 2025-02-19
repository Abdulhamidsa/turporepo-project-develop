import { Button } from '@repo/ui/components/ui/button';

const NotFound = ({ homeLink = '/', buttonText = 'Go Home' }) => {
  const handleGoHome = () => {
    window.location.href = homeLink;
  };

  return (
    <div
      className="inset-0 z-50 flex h-dvh min-h-screen flex-col items-center justify-center bg-[var(--bg-color)] p-4 text-[var(--text-color)]"
      aria-label="404 Page Not Found"
    >
      <div className="flex flex-col items-center text-center">
        <h1 className="mb-4 animate-bounce text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
        <p className="mb-6 text-2xl md:text-3xl">
          Oops! The page you're looking for doesn't exist.
        </p>
      </div>
      <Button
        onClick={handleGoHome}
        className="rounded-lg bg-[var(--primary-color)] px-8 py-3 text-lg font-semibold text-[var(--text-color)] shadow-md transition-transform duration-300 hover:scale-110 hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-2"
        aria-label="Go to Home"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default NotFound;

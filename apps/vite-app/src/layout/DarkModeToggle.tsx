import { useEffect, useState } from 'react';

import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const classList = document.documentElement.classList;
    const theme = isDarkMode ? 'dark' : 'light';
    classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <button
      onClick={toggleDarkMode}
      className="bg-muted hover:bg-muted-foreground rounded-full p-2 transition-colors"
    >
      <span className="sr-only">Toggle Dark Mode</span>
      {isDarkMode ? (
        <Moon className="text-primary h-5 w-5" />
      ) : (
        <Sun className="text-primary h-5 w-5" />
      )}
    </button>
  );
}

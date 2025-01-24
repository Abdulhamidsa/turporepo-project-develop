import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const classList = document.documentElement.classList;
    const theme = isDarkMode ? "dark" : "light";
    classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-full bg-muted hover:bg-muted-foreground transition-colors">
      <span className="sr-only">Toggle Dark Mode</span>
      {isDarkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
    </button>
  );
}

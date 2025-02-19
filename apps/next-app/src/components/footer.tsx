import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 text-center md:mb-0 md:text-left">
            <h2 className="text-lg font-semibold">Profolio</h2>
            <p className="text-muted-foreground text-sm">Connecting talents worldwide</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          © {new Date().getFullYear()} Profolio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

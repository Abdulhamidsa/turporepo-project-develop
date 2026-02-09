import { Code2, Layers, Users, Zap } from 'lucide-react';

import { NavbarApp } from '../layout/NavbarApp';

export default function Auth() {
  return (
    <div className="min-h-screen w-full bg-background">
      <NavbarApp />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Code2 className="w-4 h-4" />
              For Developers & Tech Professionals
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Your Work.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Your Network.
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Showcase your projects, connect with developers worldwide, and grow your professional
              network.
            </p>
            {/* 
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-semibold"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => (window.location.href = '/feed')}
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-semibold"
              >
                Explore Developers
              </Button>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Built for Developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to showcase your work and connect with the developer community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Showcase Projects</h3>
              <p className="text-muted-foreground leading-relaxed">
                Display your best work with rich project pages, code snippets, and live demos. Make
                your portfolio stand out.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Grow Your Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with developers worldwide. Share insights, get feedback, and build
                meaningful professional relationships.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Fast & Simple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set up your developer profile in minutes. No complicated setup, just focus on
                sharing your work and connecting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="text-2xl font-bold text-foreground">ProFolio</div>
            <p className="text-muted-foreground max-w-md">
              A platform for developers to showcase their work and grow their professional network.
            </p>
            <div className="text-sm text-muted-foreground pt-4">
              © {new Date().getFullYear()} ProFolio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

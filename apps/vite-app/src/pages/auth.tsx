import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@repo/ui/components/ui/dialog';
import { Briefcase, Globe, Palette, Rocket, Users, Zap } from 'lucide-react';

import SignupForm from '../features/auth/components/SignUpForm';
import SigninForm from '../features/auth/components/SigninForm';

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState<{
    mode: 'signin' | 'signup' | null;
    prefillValues?: { email?: string } | undefined;
  }>({
    mode: null,
  });

  const openSignUp = () => setIsSignIn({ mode: 'signup' });

  const closeModal = () => setIsSignIn({ mode: null });

  return (
    <div className="from-muted to-background text-foreground min-h-screen w-full bg-gradient-to-br">
      {/* Hero Section */}
      <div
        className="relative flex h-screen flex-col items-center justify-center px-4 text-center"
        style={{
          backgroundImage: `url('https://source.unsplash.com/1600x900/?gradient,abstract')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>
        <h1 className="relative z-10 text-5xl font-extrabold text-white sm:text-7xl">
          Build, Showcase, and Connect with <span className="text-primary">Professionals</span>
        </h1>
        <p className="relative z-10 mt-6 max-w-3xl text-lg text-gray-300 sm:text-xl">
          Welcome to your ultimate portfolio builder. Create your professional presence, showcase
          your skills, and connect with a vibrant community.
        </p>
        <div className="relative z-10 mt-8 flex space-x-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-dark px-8 py-3 text-white shadow-md"
            onClick={openSignUp}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-foreground text-4xl font-extrabold">Why Choose Us?</h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Tools, community, and design to elevate your professional journey.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[Briefcase, Users, Palette, Rocket, Zap, Globe].map((Icon, index) => (
              <div
                key={index}
                className="bg-card flex transform flex-col items-center rounded-xl p-8 shadow-xl transition-transform hover:-translate-y-2"
              >
                <div className="bg-primary rounded-full p-4 text-white">
                  <Icon className="h-12 w-12" />
                </div>
                <h3 className="text-foreground mt-6 text-xl font-bold">
                  {
                    [
                      'Beautiful Portfolios',
                      'Engaging Community',
                      'Customizable Templates',
                      'Built for Professionals',
                      'Easy to Use',
                      'Share Your Work',
                    ][index]
                  }
                </h3>
                <p className="mt-3 text-gray-600">
                  {
                    [
                      'Showcase your skills with professionally designed templates.',
                      'Connect, collaborate, and grow with like-minded professionals.',
                      'Tailor your portfolio to match your personal brand.',
                      "Designed with you in mind, whether you're a developer, designer, or creator.",
                      'Create a stunning portfolio in minutes with our intuitive builder.',
                      'Publish your projects and get noticed by employers and peers.',
                    ][index]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="from-primary to-primary/90 bg-gradient-to-br py-16 text-center text-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-extrabold">Ready to Build Your Portfolio?</h2>
          <p className="mt-4 text-lg">
            Take your professional presence to the next level. It's free and easy to get started.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="text-primary bg-white px-8 py-3 hover:bg-gray-200"
              onClick={openSignUp}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-border border-t py-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} PortConnect. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Dialog for Forms */}
      <Dialog open={!!isSignIn.mode} onOpenChange={closeModal}>
        <DialogContent className="bg-card text-card-foreground fixed left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 transform rounded-lg p-8 shadow-xl sm:w-[400px]">
          <DialogHeader></DialogHeader>
          {isSignIn.mode === 'signin' ? (
            <SigninForm
              setIsSignIn={(val) => setIsSignIn({ mode: val ? 'signin' : 'signup' })}
              prefillValues={isSignIn.prefillValues}
            />
          ) : (
            <SignupForm
              setIsSignIn={(val, prefill) =>
                setIsSignIn({ mode: val ? 'signin' : 'signup', prefillValues: prefill })
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

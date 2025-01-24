import SignupForm from "../features/auth/components/SignUpForm";
import SigninForm from "../features/auth/components/SigninForm";
import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@repo/ui/components/ui/dialog";
import { Briefcase, Users, Palette, Rocket, Globe, Zap } from "lucide-react";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState<{
    mode: "signin" | "signup" | null;
    prefillValues?: { email?: string } | undefined;
  }>({
    mode: null,
  });

  const openSignUp = () => setIsSignIn({ mode: "signup" });

  const closeModal = () => setIsSignIn({ mode: null });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-muted to-background text-foreground">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-screen px-4 text-center" style={{ backgroundImage: `url('https://source.unsplash.com/1600x900/?gradient,abstract')`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-lg"></div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white relative z-10">
          Build, Showcase, and Connect with <span className="text-primary">Professionals</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl relative z-10">Welcome to your ultimate portfolio builder. Create your professional presence, showcase your skills, and connect with a vibrant community.</p>
        <div className="mt-8 flex space-x-4 relative z-10">
          <Button size="lg" className="px-8 py-3 bg-primary text-white shadow-md hover:bg-primary-dark" onClick={openSignUp}>
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-foreground">Why Choose Us?</h2>
          <p className="mt-2 text-lg text-muted-foreground">Tools, community, and design to elevate your professional journey.</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[Briefcase, Users, Palette, Rocket, Zap, Globe].map((Icon, index) => (
              <div key={index} className="flex flex-col items-center bg-card p-8 rounded-xl shadow-xl transition-transform transform hover:-translate-y-2">
                <div className="p-4 bg-primary rounded-full text-white">
                  <Icon className="w-12 h-12" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{["Beautiful Portfolios", "Engaging Community", "Customizable Templates", "Built for Professionals", "Easy to Use", "Share Your Work"][index]}</h3>
                <p className="mt-3 text-gray-600">
                  {
                    [
                      "Showcase your skills with professionally designed templates.",
                      "Connect, collaborate, and grow with like-minded professionals.",
                      "Tailor your portfolio to match your personal brand.",
                      "Designed with you in mind, whether you're a developer, designer, or creator.",
                      "Create a stunning portfolio in minutes with our intuitive builder.",
                      "Publish your projects and get noticed by employers and peers.",
                    ][index]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-extrabold">Ready to Build Your Portfolio?</h2>
          <p className="mt-4 text-lg">Take your professional presence to the next level. It's free and easy to get started.</p>
          <div className="mt-8">
            <Button size="lg" className="px-8 py-3 bg-white text-primary hover:bg-gray-200" onClick={openSignUp}>
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PortConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Dialog for Forms */}
      <Dialog open={!!isSignIn.mode} onOpenChange={closeModal}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card text-card-foreground p-8 rounded-lg shadow-xl w-[90%] sm:w-[400px]">
          <DialogHeader></DialogHeader>
          {isSignIn.mode === "signin" ? (
            <SigninForm setIsSignIn={(val) => setIsSignIn({ mode: val ? "signin" : "signup" })} prefillValues={isSignIn.prefillValues} />
          ) : (
            <SignupForm setIsSignIn={(val, prefill) => setIsSignIn({ mode: val ? "signin" : "signup", prefillValues: prefill })} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

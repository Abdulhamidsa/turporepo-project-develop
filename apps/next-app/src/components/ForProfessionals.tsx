'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import Link from 'next/link';

export default function ForProfessionals() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-foreground mb-8 text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
        For Professionals
      </h1>

      <div className="mx-auto max-w-4xl space-y-12">
        <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base sm:text-lg md:text-xl">
          Your portfolio should be about your work, not about figuring out design & deployment. With{' '}
          <span className="text-primary font-medium">ProFolio</span>, showcase your expertise in
          minutes and connect with a thriving community of professionals.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-card border-border border shadow-md">
            <CardHeader>
              <CardTitle className="text-card-foreground text-lg sm:text-xl lg:text-2xl">
                Effortless Portfolio Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm sm:text-base md:text-lg">
              <p>Launch a professional portfolio in minutes—no coding or design skills needed.</p>
              <p>Showcase your best projects beautifully and professionally.</p>
              <p>Instant exposure to potential clients, recruiters, and industry leaders.</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border border shadow-md">
            <CardHeader>
              <CardTitle className="text-card-foreground text-lg sm:text-xl lg:text-2xl">
                Grow With a Supportive Community
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-4 text-sm sm:text-base md:text-lg">
              <p>Get feedback and insights to refine your work.</p>
              <p>Connect with like-minded professionals for collaboration & growth.</p>
              <p>Engage in meaningful discussions and share industry knowledge.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-primary text-primary-foreground mt-12 rounded-lg p-6 text-center sm:p-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Ready to Take Control of Your Portfolio?
          </h2>
          <p className="text-secondary-foreground mb-6 text-base sm:text-lg md:text-xl">
            Join thousands of professionals managing their work with ProFolio.
          </p>
          <Link href="https://profolio.abdulhamidma.com" target="_blank" rel="noopener noreferrer">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 text-base transition sm:text-lg md:text-xl">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

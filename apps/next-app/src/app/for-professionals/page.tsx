import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ForProfessionalsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">For Professionals</h1>

      <div className="mx-auto max-w-4xl space-y-8">
        <p className="mb-12 text-center text-xl">
          Showcase your talent, connect with clients, and grow your career with Profolio.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Customizable profile page
              </p>
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Showcase your best projects
              </p>
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Highlight your skills and experience
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect and Grow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Network with other professionals
              </p>
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Get discovered by potential clients
              </p>
              <p className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Receive job opportunities
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 rounded-lg bg-gradient-to-r from-purple-700 to-pink-600 p-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">
            Ready to Showcase Your Talent?
          </h2>
          <p className="mb-6 text-center text-white">
            Join thousands of professionals who are already benefiting from Profolio.
          </p>
          <div className="text-center">
            <Link href="http://localhost:5173/auth" target="_blank" rel="noopener noreferrer">
              <Button>Go to External Site</Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <ol className="space-y-4">
            <li className="flex items-center">
              <span className="bg-primary text-primary-foreground mr-4 flex h-8 w-8 items-center justify-center rounded-full">
                1
              </span>
              <span>Sign up for a free account on our platform</span>
            </li>
            <li className="flex items-center">
              <span className="bg-primary text-primary-foreground mr-4 flex h-8 w-8 items-center justify-center rounded-full">
                2
              </span>
              <span>Create your profile and add your best projects</span>
            </li>
            <li className="flex items-center">
              <span className="bg-primary text-primary-foreground mr-4 flex h-8 w-8 items-center justify-center rounded-full">
                3
              </span>
              <span>Customize your portfolio page to reflect your personal brand</span>
            </li>
            <li className="flex items-center">
              <span className="bg-primary text-primary-foreground mr-4 flex h-8 w-8 items-center justify-center rounded-full">
                4
              </span>
              <span>Share your unique portfolio URL with potential clients and employers</span>
            </li>
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Link href="http://localhost:5173/auth" target="_blank" rel="noopener noreferrer">
            <Button>Go to External Site</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

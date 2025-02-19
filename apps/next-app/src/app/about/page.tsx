import { Button } from '@repo/ui/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">About ProFolio</h1>

      <div className="mx-auto max-w-3xl space-y-6 text-lg">
        <p>
          ProFolio is a platform dedicated to connecting talented professionals with potential
          clients and employers. Our mission is to provide a space where individuals can showcase
          their skills, projects, and achievements in a visually appealing and easily accessible
          format.
        </p>

        <p>
          We believe that every professional has a unique story to tell and exceptional work to
          share. Whether you're a seasoned expert or just starting your career, Profolio offers you
          the opportunity to create a stunning online presence that truly represents your
          capabilities.
        </p>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">What We Offer</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Customizable portfolio pages to highlight your best work</li>
          <li>A community of like-minded professionals for networking and collaboration</li>
          <li>Exposure to potential clients and employers browsing for talent</li>
          <li>Tools to track your portfolio's performance and engagement</li>
        </ul>

        <h2 className="mb-4 mt-8 text-2xl font-semibold">Our Vision</h2>
        <p>
          We envision a world where talent knows no boundaries. Profolio aims to break down barriers
          between professionals and opportunities, fostering a global community of innovation and
          creativity.
        </p>

        <div className="mt-12 text-center">
          <Link href="/for-professionals">
            <Button size="lg" className="px-8 py-6 text-lg">
              Join Profolio Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

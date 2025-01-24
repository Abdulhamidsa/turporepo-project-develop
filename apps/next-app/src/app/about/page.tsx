import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">About PortfolioShowcase</h1>

      <div className="max-w-3xl mx-auto space-y-6 text-lg">
        <p>
          PortfolioShowcase is a platform dedicated to connecting talented professionals with potential clients and employers. Our mission is to provide a space where individuals can showcase their skills, projects, and achievements in a visually appealing and easily accessible
          format.
        </p>

        <p>
          We believe that every professional has a unique story to tell and exceptional work to share. Whether you're a seasoned expert or just starting your career, PortfolioShowcase offers you the opportunity to create a stunning online presence that truly represents your
          capabilities.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customizable portfolio pages to highlight your best work</li>
          <li>A community of like-minded professionals for networking and collaboration</li>
          <li>Exposure to potential clients and employers browsing for talent</li>
          <li>Tools to track your portfolio's performance and engagement</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
        <p>We envision a world where talent knows no boundaries. PortfolioShowcase aims to break down barriers between professionals and opportunities, fostering a global community of innovation and creativity.</p>

        <div className="mt-12 text-center">
          <Link href="/for-professionals">
            <Button size="lg" className="text-lg px-8 py-6">
              Join PortfolioShowcase Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

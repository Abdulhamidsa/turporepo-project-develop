'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-foreground mb-8 text-center text-3xl font-bold sm:text-4xl md:text-5xl">
        Welcome to ProFolio
      </h1>
      <div className="text-muted-foreground mx-auto max-w-3xl space-y-6 text-base sm:text-lg md:text-xl">
        <p>
          ProFolio is the <strong>public showcase</strong> for professionals who have built their
          profiles in our internal system. Once their portfolio is complete, it becomes visible here
          for potential clients, employers, and collaborators.
        </p>
        <p>
          But ProFolio is more than just a showcase—it’s a <strong>community</strong> where
          professionals can
          <strong>build, maintain, and grow</strong> their presence in a network of like-minded
          individuals.
        </p>

        {/* Public Showcase Accordion */}
        <h2 className="text-foreground mb-4 mt-8 text-2xl font-semibold sm:text-3xl md:text-4xl">
          For Visitors: Explore Public Portfolios
        </h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="showcase1">
            <AccordionTrigger>Discover Professionals</AccordionTrigger>
            <AccordionContent>
              Browse curated portfolios from skilled professionals in various industries. Whether
              you&apos;re hiring, looking for inspiration, or networking, ProFolio provides a space
              to connect with industry talent.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="showcase2">
            <AccordionTrigger>See Work That Matters</AccordionTrigger>
            <AccordionContent>
              View real-world projects, case studies, and past work that demonstrates expertise.
              Each portfolio is designed to highlight strengths and showcase impactful work.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="showcase3">
            <AccordionTrigger>Find the Right Talent</AccordionTrigger>
            <AccordionContent>
              Whether you&apos;re a recruiter, business owner, or fellow professional, ProFolio
              makes it easy to find and connect with the right people.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Internal Users Accordion */}
        <h2 className="text-foreground mb-4 mt-8 text-2xl font-semibold sm:text-3xl md:text-4xl">
          For Professionals: Join & Build Your Portfolio
        </h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="internal1">
            <AccordionTrigger>Effortless Portfolio Creation</AccordionTrigger>
            <AccordionContent>
              Build a sleek, professional portfolio in minutes—without worrying about design,
              hosting, or deployment.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="internal2">
            <AccordionTrigger>Engage with a Supportive Community</AccordionTrigger>
            <AccordionContent>
              Get feedback, share insights, and connect with like-minded professionals in a space
              built for collaboration.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="internal3">
            <AccordionTrigger>Keep Your Work Up to Date</AccordionTrigger>
            <AccordionContent>
              Easily update your portfolio as you grow—track engagement, refine content, and stay
              relevant in your field.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

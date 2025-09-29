import { Button } from '@repo/ui/components/ui/button';
import { ArrowRight, BookOpen, FolderKanban, Globe, Users } from 'lucide-react';

import { routesConfig } from '../../routes/routesConfig';

export default function ExploreSection() {
  const exploreLinks = [
    {
      title: 'Explore Professionals',
      description:
        'Find and connect with talented professionals in your industry. View their portfolios and contact them directly.',
      icon: Users,
      link: routesConfig.users,
      color: 'from-blue-500 to-purple-500',
      imageSrc: '/placeholder.png',
    },
    {
      title: 'View Projects',
      icon: FolderKanban,
      description: 'Explore innovative projects created by our talented community.',
      link: '/projects',
      color: 'from-primary to-secondary',
      imageSrc: '/placeholder.png',
    },
    {
      title: 'Learn More',
      icon: BookOpen,
      description: 'Find out how our platform can help showcase your professional skills.',
      link: '/about',
      color: 'from-purple-500 to-pink-500',
      imageSrc: '/placeholder.png',
    },
  ];

  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-background to-slate-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="bg-accent/10 text-accent px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Explore
          </span>
          <h2 className="text-4xl font-extrabold text-white">Discover Our Platform</h2>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
            Navigate through our platform's main sections to get a glimpse of what we offer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {exploreLinks.map((item, index) => (
            <div key={index} className="relative overflow-hidden rounded-xl group">
              {/* Background with gradient overlay */}
              <div className="absolute inset-0 bg-slate-800 opacity-90"></div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-50 group-hover:opacity-70 transition-opacity`}
              ></div>

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col min-h-[280px]">
                <div className="bg-white/10 p-3 rounded-lg w-14 h-14 flex items-center justify-center mb-6 backdrop-blur-sm">
                  <item.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-200 mb-6">{item.description}</p>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => (window.location.href = item.link)}
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <Globe className="h-6 w-6 text-primary mr-3" />
            <span className="text-gray-200">
              Join our global community of <span className="text-primary font-bold">1,000+</span>{' '}
              professionals
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/ui/tabs';
import { Briefcase, Code, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom type for creative professionals
interface CreativeProfessional {
  id: string;
  name: string;
  email: string;
  location: string;
  profession: string;
  profileImage: string;
  bio: string;
  skills: string[];
  projects: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: string;
  lastActive: string;
}

interface ProfessionalListProps {
  professionals: CreativeProfessional[];
}

interface ProfessionalCardProps {
  professional: CreativeProfessional;
}

interface AddToFavouriteProps {
  professionalId: string;
}

// Mock data - Creative professionals from design to development
const mockProfessionals: CreativeProfessional[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    location: 'United States',
    profession: 'UI/UX Designer',
    profileImage: 'https://randomuser.me/api/portraits/men/44.jpg',
    bio: 'Award-winning UI/UX designer with 8+ years experience creating intuitive digital experiences for startups and enterprise clients.',
    skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping'],
    projects: ['Finance App Redesign', 'E-commerce Website'],
    languages: ['English', 'Mandarin'],
    rating: 4.9,
    reviewCount: 87,
    hourlyRate: 95,
    availability: 'Available',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    location: 'Spain',
    profession: 'Frontend Developer',
    profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
    bio: 'Frontend developer specializing in React and Vue.js with a passion for creating performant and accessible web applications.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Jest'],
    projects: ['SaaS Dashboard', 'Real Estate Platform'],
    languages: ['English', 'Spanish'],
    rating: 4.8,
    reviewCount: 65,
    hourlyRate: 85,
    availability: 'Busy',
    lastActive: '1 day ago',
  },
  {
    id: '3',
    name: 'Jamal Williams',
    email: 'jamal.williams@example.com',
    location: 'United Kingdom',
    profession: 'Full Stack Developer',
    profileImage: 'https://randomuser.me/api/portraits/men/23.jpg',
    bio: 'Full stack developer with expertise in Node.js, React, and cloud architecture. Passionate about building scalable web applications.',
    skills: ['Node.js', 'React', 'AWS', 'MongoDB', 'GraphQL'],
    projects: ['E-learning Platform', 'Social Media App'],
    languages: ['English', 'French'],
    rating: 4.7,
    reviewCount: 52,
    hourlyRate: 105,
    availability: 'Available',
    lastActive: '3 hours ago',
  },
  {
    id: '4',
    name: 'Emma Anderson',
    email: 'emma.anderson@example.com',
    location: 'Australia',
    profession: 'Motion Designer',
    profileImage: 'https://randomuser.me/api/portraits/women/52.jpg',
    bio: 'Motion designer and animator creating engaging visual stories for brands and digital products.',
    skills: ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Animation', 'Storyboarding'],
    projects: ['Brand Animation Series', 'Product Launch Videos'],
    languages: ['English'],
    rating: 4.8,
    reviewCount: 41,
    hourlyRate: 90,
    availability: 'Busy',
    lastActive: '5 hours ago',
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@example.com',
    location: 'South Korea',
    profession: 'Backend Developer',
    profileImage: 'https://randomuser.me/api/portraits/men/76.jpg',
    bio: 'Backend developer specializing in microservices architecture and cloud infrastructure with AWS and Google Cloud.',
    skills: ['Python', 'Golang', 'Kubernetes', 'AWS', 'System Design'],
    projects: ['Payment Processing System', 'API Gateway Implementation'],
    languages: ['English', 'Korean'],
    rating: 4.9,
    reviewCount: 73,
    hourlyRate: 110,
    availability: 'Available',
    lastActive: '1 hour ago',
  },
];

// Simple component to add/remove from favorites
const AddToFavourite: React.FC<AddToFavouriteProps> = ({ professionalId }) => {
  const [isFavourite, setIsFavourite] = React.useState<boolean>(false);

  const handleFavouriteToggle = () => {
    setIsFavourite(!isFavourite);
    console.log(`${isFavourite ? 'Removed from' : 'Added to'} favorites: ${professionalId}`);
  };

  return (
    <Button
      variant={isFavourite ? 'outline' : 'default'}
      size="sm"
      onClick={handleFavouriteToggle}
      className="ml-auto"
    >
      {isFavourite ? 'Remove from Favorites' : 'Add to Favorites'}
    </Button>
  );
};

// Professional card component
const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <Link to={`/profile/${professional.id}`}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={professional.profileImage} alt={professional.name} />
            <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center">
            <Link
              to={`/profile/${professional.id}`}
              className="hover:text-primary transition-colors"
            >
              <CardTitle>{professional.name}</CardTitle>
            </Link>
            <Badge variant="outline" className="ml-2">
              {professional.profession}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>{professional.location}</span>
          </div>
        </div>
        <AddToFavourite professionalId={professional.id} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{professional.bio}</p>
        <div className="mb-2">
          <p className="text-sm font-medium mb-1">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {professional.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="mr-1 mb-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center mt-3">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium">{professional.rating}</span>
            <span className="text-gray-500 ml-1">({professional.reviewCount} reviews)</span>
          </div>
          <div className="ml-auto flex items-center">
            <span className="font-medium text-green-600">${professional.hourlyRate}/hr</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1 ${
              professional.availability === 'Available' ? 'bg-green-500' : 'bg-amber-500'
            }`}
          ></span>
          {professional.availability} • Last active {professional.lastActive}
        </div>
        <Button onClick={() => (window.location.href = `/public-profile/${professional.id}`)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

// List of professionals
const ProfessionalList: React.FC<ProfessionalListProps> = ({ professionals }) => {
  return (
    <div className="space-y-4">
      {professionals.map((professional) => (
        <ProfessionalCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};

// Main page component
export default function CreativeProfessionalsPage() {
  React.useEffect(() => {
    // Set document title
    document.title = 'Creative Professionals | ProFolio';

    // Log for debugging
    console.log('CreativeProfessionalsPage mounted');
    console.log('Current pathname:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple standalone navbar */}
      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            ProFolio
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/discover/professionals"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Users size={16} />
              <span>Explore Users</span>
            </Link>
            <Link
              to="/creative-professionals"
              className="text-primary font-medium flex items-center gap-2"
            >
              <Briefcase size={16} />
              <span>Creative Professionals</span>
            </Link>
            <Link
              to="/projects"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Code size={16} />
              <span>Projects</span>
            </Link>
          </nav>
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={() => (window.location.href = '/auth')}
              className="hover:text-primary"
            >
              Sign In
            </Button>
            <Button
              onClick={() => (window.location.href = '/auth')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Account
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">Connect with Creative Professionals</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find talented designers, developers, and digital creators to collaborate with on your
              next project.
            </p>
          </div>

          <div className="bg-accent/10 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Why Professionals Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Showcase Your Work</h3>
                <p>
                  Build a compelling portfolio to highlight your skills and attract the right
                  clients.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Find Collaborators</h3>
                <p>
                  Connect with complementary professionals to create comprehensive project teams.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Grow Your Network</h3>
                <p>Expand your professional connections and discover new opportunities.</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Professionals</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="development">Development</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ProfessionalList professionals={mockProfessionals} />
            </TabsContent>

            <TabsContent value="design">
              <ProfessionalList
                professionals={mockProfessionals.filter(
                  (p) =>
                    p.profession.includes('Designer') ||
                    p.skills.some((s) =>
                      ['UI', 'UX', 'Design', 'Figma', 'Adobe'].some((term) => s.includes(term)),
                    ),
                )}
              />
            </TabsContent>

            <TabsContent value="development">
              <ProfessionalList
                professionals={mockProfessionals.filter(
                  (p) =>
                    p.profession.includes('Developer') ||
                    p.skills.some((s) =>
                      [
                        'React',
                        'JavaScript',
                        'TypeScript',
                        'Node',
                        'Python',
                        'Backend',
                        'Frontend',
                        'Full Stack',
                      ].some((term) => s.includes(term)),
                    ),
                )}
              />
            </TabsContent>

            <TabsContent value="creative">
              <ProfessionalList
                professionals={mockProfessionals.filter(
                  (p) =>
                    p.profession.includes('Motion') ||
                    p.profession.includes('Creative') ||
                    p.skills.some((s) =>
                      ['Animation', 'Video', 'Motion', 'Creative', 'After Effects'].some((term) =>
                        s.includes(term),
                      ),
                    ),
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-background border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ProFolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

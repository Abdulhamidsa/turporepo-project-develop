import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
// import { getFeaturedProjects, getFeaturedUsers } from "../lib/api";
import { Project, User } from "../types";

export default async function Home() {
  // const [users, projects] = await Promise.all([getFeaturedUsers(), getFeaturedProjects()]);

  return (
    <main>
      <section className="bg-gradient-to-r from-purple-700 to-pink-600 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Discover Amazing Talent</h1>
          <p className="text-xl mb-8">Connect with skilled professionals and explore their innovative projects</p>
          <div className="flex justify-center space-x-4">
            <Link href="/users">
              <Button size="lg" variant="secondary">
                Explore Professionals
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-700">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Professionals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* {users.map((user: User) => (
            <Link href={`/user/${user.friendlyId}`} key={user.id}>
              <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${user.coverImage})` }}></div>
                <CardContent className="pt-0">
                  <div className="flex justify-center -mt-12 mb-4">
                    <Avatar className="h-24 w-24 ring-4 ring-background">
                      <AvatarImage src={user.profilePicture} alt={user.username} />
                      <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="font-semibold text-xl text-center mb-2">{user.username}</h3>
                  <p className="text-muted-foreground text-center mb-4">{user.profession}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {user.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-center line-clamp-2">{user.bio}</p>
                </CardContent>
              </Card>
            </Link>
          ))} */}
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* {projects.map((project: Project) => (
              <Card key={project.id} className="overflow-hidden">
                <Image src={project.thumbnail} alt={project.title} width={400} height={300} className="w-full h-48 object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="outline" className="w-full">
                      View Project
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))} */}
          </div>
        </div>
      </section>
    </main>
  );
}

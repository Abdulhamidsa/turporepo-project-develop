import { useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Briefcase, ExternalLink, User } from 'lucide-react';

import { useFeaturedUsers } from '../hooks/useFeaturedUsers';
import { useProjects } from '../hooks/useProjects';
import UserProfileModal from './UserProfileModal';

function FeaturedContentComponent() {
  const { users, isLoading: usersLoading } = useFeaturedUsers(3);
  const { projects, isLoading: projectsLoading } = useProjects(3);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <section id="explore" className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="bg-secondary/10 text-secondary px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">
            Community Spotlight
          </span>
          <h2 className="text-4xl font-extrabold">Featured Professionals</h2>
          <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
            Discover talented individuals who are already building their presence on our platform.
          </p>
        </div>

        {/* Featured Users */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <User className="mr-2 h-6 w-6 text-primary" />
            <span>Top Professionals</span>
          </h3>

          {usersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl h-[300px] animate-pulse bg-card/50"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="relative group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsUserModalOpen(true);
                  }}
                >
                  <div className="h-24 bg-gradient-to-r from-primary to-secondary opacity-90"></div>

                  <div className="p-6 pt-0 relative">
                    <div className="relative -mt-12 mb-4 h-24 w-24 rounded-full border-4 border-background overflow-hidden bg-background">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary">
                          <User size={40} />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold">{user.username}</h3>
                    <p className="text-primary font-medium mb-2">
                      {user.profession || 'Professional'}
                    </p>

                    {user.bio && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{user.bio}</p>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex space-x-2">
                        {user.skills?.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                          >
                            {skill.name}
                          </span>
                        )) || (
                          <>
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                              Developer
                            </span>
                            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                              Creative
                            </span>
                          </>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-secondary relative z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/profile/${user.friendlyId || user.id}`, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {users.length === 0 && !usersLoading && (
                <div className="col-span-3 text-center p-8 bg-card/50 rounded-xl border border-border">
                  <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">
                    Be the first to join our professional community!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Projects */}
        <div>
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Briefcase className="mr-2 h-6 w-6 text-primary" />
            <span>Featured Projects</span>
          </h3>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl h-[250px] animate-pulse bg-card/50"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="bg-card rounded-xl overflow-hidden border border-border group hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => window.open(`/project/${project.id}`, '_blank')}
                >
                  <div className="h-48 overflow-hidden relative">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10">
                        <Briefcase className="h-16 w-16 text-primary/40" />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-8 w-8 rounded-full overflow-hidden bg-background border border-white/20 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.user) {
                              setSelectedUser(project.user);
                              setIsUserModalOpen(true);
                            }
                          }}
                        >
                          {project.user?.profilePicture ? (
                            <img
                              src={project.user.profilePicture}
                              alt={project.user.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/20">
                              <User size={16} className="text-primary" />
                            </div>
                          )}
                        </div>
                        <span
                          className="text-white text-sm font-medium cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (project.user) {
                              setSelectedUser(project.user);
                              setIsUserModalOpen(true);
                            }
                          }}
                        >
                          {project.user?.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 line-clamp-1">{project.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {project.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-muted-foreground text-sm">
                        <span className="flex items-center">{project.likesCount} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {projects.length === 0 && !projectsLoading && (
                <div className="col-span-3 text-center p-8 bg-card/50 rounded-xl border border-border">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                  <p className="text-muted-foreground">Create an account to showcase your work!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="space-x-4">
            <a href="/users" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                Browse All Users
              </Button>
            </a>
            <a href="/projects" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
              >
                View All Projects
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
      />
    </section>
  );
}

// Make sure we export both as default and named export
export default FeaturedContentComponent;
export { FeaturedContentComponent };

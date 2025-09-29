import React, { useEffect, useState } from 'react';

import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { Input } from '@repo/ui/components/ui/input';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Search,
} from 'lucide-react';

import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../features/user/hooks/use.auth';
import ProjectCardModal from './ProjectCardModal';

interface Tag {
  id: string | number;
  name: string;
}

interface ProjectOwner {
  id: string | number;
  username?: string;
  profilePicture?: string;
  friendlyId?: string;
  profession?: string;
}

interface Project {
  id: string | number;
  title: string;
  description?: string;
  coverImage?: string;
  shortDescription?: string;
  createdAt?: string | Date;
  repoUrl?: string;
  demoUrl?: string;
  tags?: Tag[];
  owner?: ProjectOwner;
}

interface ProjectsGalleryProps {
  initialPage?: number;
  pageSize?: number;
}

export default function ProjectsGallery({ initialPage = 1, pageSize = 12 }: ProjectsGalleryProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const url = `${baseUrl}/api/projects?page=${page}&limit=${pageSize}&search=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProjects();
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Discover Projects</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, description, or tags..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="text-center my-8 text-red-500">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchProjects} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-40 bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full mb-2" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Empty State */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No projects found matching your search criteria.
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <>
              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer h-full flex flex-col"
                    onClick={() => handleProjectClick(project)}
                  >
                    {/* Project Cover Image */}
                    <div className="relative h-40 w-full bg-muted">
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10">
                          <ImageIcon className="h-10 w-10 text-primary/40" />
                        </div>
                      )}

                      {/* Lock icon for authenticated content */}
                      {!isAuthenticated && (
                        <div className="absolute top-2 right-2 bg-background/70 rounded-full p-1">
                          <span className="w-4 h-4 text-primary flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Project Content */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {formatDate(project.createdAt)}
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">
                        {project.shortDescription ||
                          project.description ||
                          'No description available.'}
                      </p>

                      {/* Project Links - Minimal View */}
                      <div className="flex items-center justify-between mt-4 text-xs">
                        <div className="flex gap-3">
                          {project.repoUrl && (
                            <span className="flex items-center text-muted-foreground">
                              <Github className="h-3.5 w-3.5 mr-1" />
                              Repo
                            </span>
                          )}

                          {project.demoUrl && (
                            <span className="flex items-center text-muted-foreground">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Demo
                            </span>
                          )}
                        </div>

                        {/* Owner */}
                        {project.owner?.username && (
                          <span className="text-muted-foreground truncate max-w-[120px]">
                            by {project.owner.username}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8 gap-2">
                <Button variant="outline" onClick={goToPreviousPage} disabled={page <= 1} size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="text-sm text-muted-foreground flex items-center px-3">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={goToNextPage}
                  disabled={page >= totalPages}
                  size="sm"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {/* Project Detail Modal */}
      <ProjectCardModal
        project={selectedProject}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

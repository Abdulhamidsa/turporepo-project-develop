/* eslint-disable import/order */
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/ui/avatar';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/ui/card';
import { fetchProjectWithUserType } from '@repo/zod/validation/project';
import Image from 'next/image';
import Link from 'next/link';

import { SearchForm } from '../../components/search-form';
import { getProjects } from '../../lib/api';

export const dynamic = 'force-dynamic';
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt((searchParams.page as string) || '1', 10);
  const search = (searchParams.search as string) || '';

  const { projects, totalPages } = await getProjects(page, 12, search);

  if (!projects || !Array.isArray(projects)) {
    return <p>Error loading projects. Please try again later.</p>;
  }
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">All Projects</h1>
      <SearchForm initialSearch={search} searchType={'projects'} />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project: fetchProjectWithUserType) => (
            <Card key={project.id} className="overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.title}
                width={400}
                height={300}
                className="h-48 w-full object-cover"
              />
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center space-x-2">
                  {project.user && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={project.user.profilePicture || ''}
                        alt={project.user.username}
                      />
                      <AvatarFallback>
                        {project.user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {project.user && <span className="text-sm">{project.user.username}</span>}
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                  {project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center">No projects found.</p>
        )}
      </div>
      <div className="mt-8 flex justify-center space-x-2">
        {page > 1 && (
          <Link href={`/projects?page=${page - 1}&search=${search}`}>
            <Button>Previous</Button>
          </Link>
        )}
        {page < totalPages && (
          <Link href={`/projects?page=${page + 1}&search=${search}`}>
            <Button>Next</Button>
          </Link>
        )}
      </div>
      <p className="mt-4 text-center">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}

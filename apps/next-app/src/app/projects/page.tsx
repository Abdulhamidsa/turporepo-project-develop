// app/projects/page.tsx
import React from 'react';

import ProjectsListClient from '../../components/ProjectsListClient';
// eslint-disable-next-line import/order
import { SearchForm } from '../../components/search-form';
// eslint-disable-next-line import/order
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
      <SearchForm initialSearch={search} searchType="projects" />
      <ProjectsListClient projects={projects} page={page} totalPages={totalPages} search={search} />
    </div>
  );
}

import React from 'react';

import { Metadata } from 'next';

import ProjectsListClient from '../../components/ProjectsListClient';
// eslint-disable-next-line import/order
import { SearchForm } from '../../components/SearchForm';
// eslint-disable-next-line import/order
import { getProjects } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Explore Projects - ProFolio',
  description: 'Browse and discover top projects created by professionals in various industries.',
};
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">All Projects</h1>
      <SearchForm initialSearch={search} searchType="projects" />
      <ProjectsListClient projects={projects} page={page} totalPages={totalPages} search={search} />
    </div>
  );
}

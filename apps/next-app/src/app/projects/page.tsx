/* eslint-disable import/order */
import { Metadata } from 'next';

import ProjectsListClient from '../../components/ProjectsListClient';
import { SearchForm } from '../../components/SearchForm';
import { getProjects } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Explore Projects - ProFolio',
  description: 'Browse and discover top projects created by professionals in various industries.',
};
type ProjectsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};
export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ searchParams = {} }: ProjectsPageProps) {
  const page = parseInt((searchParams?.page as string) || '1', 10);
  const search = (searchParams?.search as string) || '';

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

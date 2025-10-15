import { Metadata } from 'next';

import ProjectsListClient from '../../components/ProjectsListClient';
import { SearchForm } from '../../components/SearchForm';
import { getProjects } from '../../lib/api';

export const metadata: Metadata = {
  title: 'Explore Projects - ProFolio',
  description: 'Browse and discover top projects created by professionals in various industries.',
};

type AsyncSearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ searchParams }: { searchParams: AsyncSearchParams }) {
  const params = await searchParams;
  const page = Number.parseInt((params.page as string) || '1', 10);
  const search = (params.search as string) || '';

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

import { FC } from 'react';

interface ProjectSelectionProps {
  projects: { title: string }[];
  selectProject: (title: string) => void;
}

const ProjectSelection: FC<ProjectSelectionProps> = ({ projects, selectProject }) => {
  return (
    <div className="mt-3 space-y-2">
      <h4 className="font-semibold text-white">Select a project:</h4>
      {projects.map((proj, idx) => (
        <button
          key={idx}
          onClick={() => selectProject(proj.title)}
          className="w-full rounded bg-gray-700 p-2 text-white transition-all hover:bg-gray-600"
        >
          {idx + 1}. {proj.title}
        </button>
      ))}
    </div>
  );
};

export default ProjectSelection;

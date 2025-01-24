// import React, { useState } from "react";
// import { useAllProjects } from "../../../hooks/use.project.all";

// const ProjectList: React.FC = () => {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(5); // Limit reduced for smaller cards
//   const { projects, error } = useAllProjects(page, limit);

//   const handleNextPage = () => {
//     if (projects.length > 0) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     setPage((prev) => Math.max(prev - 1, 1));
//   };

//   if (error) {
//     return <div className="text-center text-destructive mt-4">Error loading projects.</div>;
//   }

//   if (!Array.isArray(projects)) {
//     return <div className="text-center text-muted-foreground mt-4">No more data</div>;
//   }

//   return (
//     <div className="p-4 flex flex-col items-center space-y-8">
//       {projects.length === 0 && page === 1 ? (
//         <div className="text-center text-muted-foreground mt-4">No projects available.</div>
//       ) : (
//         <>
//           <div className="w-full h-screen overflow-y-auto">
//             {projects.length > 0 ? (
//               <div className="flex flex-col">
//                 {projects.map((project) => (
//                   <div key={project._id} className="w-full h-screen flex flex-col bg-card text-card-foreground rounded-lg shadow-md border border-border overflow-hidden">
//                     {/* Thumbnail */}
//                     {project.thumbnail && (
//                       <div className="h-1/2">
//                         <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
//                       </div>
//                     )}

//                     {/* Content */}
//                     <div className="h-1/2 overflow-y-auto p-6 flex flex-col">
//                       <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
//                       <p className="text-muted-foreground text-base mb-6">{project.description}</p>

//                       <div className="mb-4">
//                         <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:text-secondary">
//                           Visit Project
//                         </a>
//                       </div>

//                       {/* Tags */}
//                       <div className="flex flex-wrap gap-2 mb-4">
//                         {project.tags.map((tag) => (
//                           <span key={tag.id} className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
//                             {tag.name}
//                           </span>
//                         ))}
//                       </div>

//                       {/* Optional: More data can be added here */}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex justify-center items-center w-full h-screen text-muted-foreground">No projects available.</div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ProjectList;

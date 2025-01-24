// import { useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
// // import {  useUserProjects } from "../features/user/hooks/use.user.profile";
// import UploadPost from "../features/user/components/AddContentButton";
// export default function Feed() {
//   const [activeTab, setActiveTab] = useState("projects");
//   // const { projects } = useUserProjects();

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-foreground">czxczxFeed</h1>
//         <UploadPost />
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-muted text-muted-foreground">
//           <TabsTrigger value="projects" className={`${activeTab === "projects" ? "border-b-2 border-primary text-primary" : ""}`}>
//             Projects
//           </TabsTrigger>
//           <TabsTrigger value="status" className={`${activeTab === "status" ? "border-b-2 border-primary text-primary" : ""}`}>
//             Status
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="projects" className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
//         </TabsContent>
//         <TabsContent value="status" className="mt-6">
//           {/* <div className="space-y-6">
//             {statuses.map((status) => (
//               <StatusCard key={status.id} status={status} />
//             ))}
//           </div> */}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
// import PostList from "./components/PostList";

// export default function Feed() {
//   return (
//     <div className="min-h-screen bg-black text-gray-200">
//       <div className="container mx-auto p-4 max-w-2xl">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-primary">Feed</h1>
//         </div>
//         <Tabs defaultValue="posts" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 bg-gray-900">
//             <TabsTrigger value="posts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
//               Posts
//             </TabsTrigger>
//             <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
//               Projects
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="posts">
//             <PostList />
//           </TabsContent>
//           <TabsContent value="projects">{/* <ProjectList /> */}</TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

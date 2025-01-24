// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
// import { Button } from "@repo/ui/components/ui/button";
// import { Textarea } from "@repo/ui/components/ui/textarea";
// import { Input } from "@repo/ui/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
// import { Badge } from "@repo/ui/components/ui/badge";
// import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
// import { Pencil, Sparkles, Code2, Rocket, MessageSquare } from "lucide-react";

// type Milestone = {
//   year: string;
//   title: string;
//   description: string;
// };

// type Section = {
//   title: string;
//   content: string;
//   milestones?: Milestone[];
// };

// const initialSections: Section[] = [
//   {
//     title: "Journey",
//     content: "My professional journey in web development has been an exciting adventure of growth and innovation.",
//     milestones: [
//       { year: "2018", title: "First Line of Code", description: "Wrote my first 'Hello, World!' in JavaScript" },
//       { year: "2019", title: "Frontend Mastery", description: "Dove deep into React and fell in love with component-based architecture" },
//       { year: "2021", title: "Full Stack Evolution", description: "Expanded my skills to include Node.js and database management" },
//       { year: "2023", title: "Cloud Pioneer", description: "Embraced cloud technologies and microservices architecture" },
//     ],
//   },
//   {
//     title: "Skill Arsenal",
//     content: `• Frontend: React, Next.js, TypeScript
// • Backend: Node.js, Express, GraphQL
// • Database: MongoDB, PostgreSQL
// • Cloud: AWS, Docker, Kubernetes
// • Testing: Jest, Cypress`,
//   },
//   {
//     title: "Connect",
//     content: "I'm always excited to collaborate on innovative projects or discuss new opportunities. Let's create something amazing together!",
//   },
// ];

// const randomFacts = [
//   "I once debugged code while skydiving. Talk about a race against time!",
//   "My cat is my unofficial rubber duck debugger.",
//   "I can type 100 words per minute... in binary.",
//   "I dream in JavaScript and wake up with solutions.",
//   "I believe semicolons are just winky faces for your code.",
// ];

// const skillCategories = [
//   { name: "Frontend", icon: <Code2 className="w-4 h-4" /> },
//   { name: "Backend", icon: <Rocket className="w-4 h-4" /> },
//   { name: "Database", icon: <MessageSquare className="w-4 h-4" /> },
// ];

// export function AboutMe() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [sections, setSections] = useState(initialSections);
//   const [randomFact, setRandomFact] = useState("");
//   const [isPublicView] = useState(false);

//   useEffect(() => {
//     setRandomFact(randomFacts[Math.floor(Math.random() * randomFacts.length)]);
//   }, []);

//   const handleSave = () => {
//     console.log("Updated sections:", sections);
//     setIsEditing(false);
//   };

//   const handleCancel = () => {
//     setSections(initialSections);
//     setIsEditing(false);
//   };

//   const updateMilestone = (sectionIndex: number, milestoneIndex: number, field: keyof Milestone, value: string) => {
//     setSections((prevSections) => {
//       const newSections = [...prevSections];
//       const section = { ...newSections[sectionIndex] };
//       if (section.milestones) {
//         section.milestones = section.milestones.map((milestone, index) => (index === milestoneIndex ? { ...milestone, [field]: value } : milestone));
//       }
//       newSections[sectionIndex] = section;
//       return newSections;
//     });
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//         <CardTitle className="text-3xl font-bold">My Developer Saga</CardTitle>
//         {!isPublicView && !isEditing && (
//           <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
//             <Pencil className="h-4 w-4 mr-2" />
//             Edit My Story
//           </Button>
//         )}
//       </CardHeader>
//       <CardContent>
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 p-4 bg-primary/10 rounded-lg">
//           <h3 className="text-lg font-semibold mb-2 flex items-center">
//             <Sparkles className="mr-2" /> Random Dev Fact
//           </h3>
//           <p className="italic">{randomFact}</p>
//         </motion.div>

//         <Tabs defaultValue="journey" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="journey">Journey</TabsTrigger>
//             <TabsTrigger value="skills">Skills</TabsTrigger>
//             <TabsTrigger value="connect">Connect</TabsTrigger>
//           </TabsList>
//           <AnimatePresence mode="wait">
//             {sections.map((section, index) => (
//               <TabsContent key={section.title} value={section.title.toLowerCase()}>
//                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
//                   {isEditing && !isPublicView ? (
//                     <div className="space-y-4">
//                       <Textarea value={section.content} onChange={(e) => setSections((prev) => prev.map((s, i) => (i === index ? { ...s, content: e.target.value } : s)))} className="w-full" rows={3} />
//                       {section.milestones && (
//                         <div className="space-y-4">
//                           <h4 className="font-semibold">Milestones</h4>
//                           {section.milestones.map((milestone, milestoneIndex) => (
//                             <div key={milestoneIndex} className="flex space-x-2">
//                               <Input value={milestone.year} onChange={(e) => updateMilestone(index, milestoneIndex, "year", e.target.value)} className="w-20" placeholder="Year" />
//                               <Input value={milestone.title} onChange={(e) => updateMilestone(index, milestoneIndex, "title", e.target.value)} className="flex-1" placeholder="Title" />
//                               <Input value={milestone.description} onChange={(e) => updateMilestone(index, milestoneIndex, "description", e.target.value)} className="flex-2" placeholder="Description" />
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div>
//                       <p className="whitespace-pre-wrap mb-4">{section.content}</p>
//                       {section.milestones && (
//                         <ScrollArea className="h-[300px] w-full rounded-md border p-4">
//                           <div className="space-y-8">
//                             {section.milestones.map((milestone, milestoneIndex) => (
//                               <motion.div key={milestoneIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: milestoneIndex * 0.1 }} className="flex items-start">
//                                 <div className="mr-4 mt-1">
//                                   <Badge variant="outline" className="text-sm">
//                                     {milestone.year}
//                                   </Badge>
//                                 </div>
//                                 <div>
//                                   <div className="font-semibold">{milestone.title}</div>
//                                   <p className="text-sm text-muted-foreground">{milestone.description}</p>
//                                 </div>
//                               </motion.div>
//                             ))}
//                           </div>
//                         </ScrollArea>
//                       )}
//                       {section.title === "Skill Arsenal" && (
//                         <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                           {skillCategories.map((category, index) => (
//                             <motion.div key={category.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex flex-col items-center p-4 bg-secondary rounded-lg">
//                               {category.icon}
//                               <h3 className="mt-2 font-semibold">{category.name}</h3>
//                               <div className="mt-2 flex flex-wrap justify-center gap-2">
//                                 {section.content
//                                   .split("\n")
//                                   .find((line) => line.includes(category.name))
//                                   ?.split(":")[1]
//                                   .split(",")
//                                   .map((skill, skillIndex) => (
//                                     <Badge key={skillIndex} variant="secondary" className="text-xs">
//                                       {skill.trim()}
//                                     </Badge>
//                                   ))}
//                               </div>
//                             </motion.div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </motion.div>
//               </TabsContent>
//             ))}
//           </AnimatePresence>
//         </Tabs>

//         {isEditing && !isPublicView && (
//           <div className="flex justify-end space-x-2 mt-4">
//             <Button variant="outline" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>Save My Saga</Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

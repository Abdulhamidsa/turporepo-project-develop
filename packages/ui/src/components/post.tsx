// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
// import { Button } from "@repo/ui/components/ui/button";
// import { Heart, MessageCircle, Share2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { RichTextEditor } from "./rich-text-editor";
// import { CommentSection } from "./comment-section";

// interface PostProps {
//   author: {
//     name: string;
//     avatar: string;
//   };
//   content: string;
//   image?: string;
//   likes: number;
//   comments: number;
//   createdAt: string;
// }

// export function Post({ author, content, image, likes, comments, createdAt }: PostProps) {
//   const [isLiked, setIsLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);

//   return (
//     <Card className="w-full max-w-xl mx-auto my-4 overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className="flex items-center space-x-4 p-4">
//         <Avatar className="w-10 h-10">
//           <AvatarImage src={author.avatar} alt={author.name} />
//           <AvatarFallback>{author.name[0]}</AvatarFallback>
//         </Avatar>
//         <div className="flex-1 min-w-0">
//           <p className="font-semibold text-sm truncate">{author.name}</p>
//           <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(createdAt).toLocaleString()}</p>
//         </div>
//       </CardHeader>
//       <CardContent className="p-4 pt-0">
//         <RichTextEditor initialContent={content} readOnly />
//         {image && (
//           <div className="mt-2 rounded-md overflow-hidden">
//             <img src={image} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" />
//           </div>
//         )}
//       </CardContent>
//       <CardFooter className="flex justify-between items-center p-2 border-t">
//         <div className="flex space-x-2">
//           <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)} className="flex items-center space-x-1">
//             <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
//               <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
//             </motion.div>
//             <span className="text-xs">{likes + (isLiked ? 1 : 0)}</span>
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1">
//             <MessageCircle className="h-4 w-4" />
//             <span className="text-xs">{comments}</span>
//           </Button>
//         </div>
//         <Button variant="ghost" size="sm" className="text-xs">
//           <Share2 className="h-4 w-4 mr-1" />
//           Share
//         </Button>
//       </CardFooter>
//       {showComments && <CommentSection postId="123" />}
//     </Card>
//   );
// }

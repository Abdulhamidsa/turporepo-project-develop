// "use client";

// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
// import { Button } from "@repo/ui/components/ui/button";
// import { Input } from "@repo/ui/components/ui/input";

// interface Comment {
//   id: string;
//   author: {
//     name: string;
//     avatar: string;
//   };
//   content: string;
//   createdAt: string;
// }

// interface CommentSectionProps {
//   postId: string;
// }

// export function CommentSection({ postId }: CommentSectionProps) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       const comment: Comment = {
//         id: Date.now().toString(),
//         author: {
//           name: "Current User",
//           avatar: "/placeholder-avatar.jpg",
//         },
//         content: newComment,
//         createdAt: new Date().toISOString(),
//       };
//       setComments([...comments, comment]);
//       setNewComment("");
//     }
//   };

//   return (
//     <div className="p-4 border-t">
//       <h4 className="font-semibold text-sm mb-2">Comments</h4>
//       <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
//         {comments.map((comment) => (
//           <div key={comment.id} className="flex space-x-2 text-sm">
//             <Avatar className="w-6 h-6">
//               <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
//               <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="font-semibold">{comment.author.name}</p>
//               <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
//               <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="flex space-x-2">
//         <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." className="flex-grow text-sm" />
//         <Button onClick={handleAddComment} size="sm">
//           Post
//         </Button>
//       </div>
//     </div>
//   );
// }

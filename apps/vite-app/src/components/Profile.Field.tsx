// import React from "react";
// import { Input } from "@repo/ui/components/ui/input";
// import { Textarea } from "@repo/ui/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/ui/select";
// import { Pen, Check } from "lucide-react";
// import { Button } from "@repo/ui/components/ui/button";

// type Props = {
//   label: string;
//   value: any;
//   editing: boolean;
//   onEdit: () => void;
//   onSave: () => void;
//   onChange: (value: string) => void;
//   type?: "input" | "textarea" | "select";
//   selectOptions?: { value: string; label: string }[];
// };

// export const ProfileField: React.FC<Props> = ({ label, value, editing, onEdit, onSave, onChange, type = "input", selectOptions }) => {
//   return (
//     <div className="flex items-center justify-between bg-muted rounded-lg p-3">
//       <div className="w-full">
//         <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
//         {editing ? (
//           type === "textarea" ? (
//             <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} />
//           ) : type === "select" && selectOptions ? (
//             <Select onValueChange={onChange} defaultValue={value || ""}>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select" />
//               </SelectTrigger>
//               <SelectContent className="bg-card text-card-foreground max-h-60 overflow-y-auto z-50">
//                 {selectOptions.map((opt) => (
//                   <SelectItem key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           ) : (
//             <Input value={value || ""} onChange={(e) => onChange(e.target.value)} />
//           )
//         ) : (
//           <p className="mt-1">{value?.toString() || ""}</p>
//         )}
//       </div>

//       {editing ? (
//         <Button variant="ghost" size="icon" onClick={onSave} className="text-primary">
//           <Check className="h-4 w-4" />
//         </Button>
//       ) : (
//         <Button variant="ghost" size="icon" onClick={onEdit}>
//           <Pen className="h-4 w-4" />
//         </Button>
//       )}
//     </div>
//   );
// };

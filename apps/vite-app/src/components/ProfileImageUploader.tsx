// import React from "react";
// import { Camera } from "lucide-react";

// type Props = {
//   src: string;
//   alt: string;
//   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   imgClassName?: string;
//   wrapperClassName?: string;
//   cameraClassName?: string;
// };

// export const ProfileImageUploader: React.FC<Props> = ({ src, alt, onChange, imgClassName, wrapperClassName, cameraClassName }) => {
//   return (
//     <div className={`relative ${wrapperClassName || ""}`}>
//       <img src={src} alt={alt} className={imgClassName} />
//       <label className="absolute bottom-2 right-2 cursor-pointer">
//         <Camera className={cameraClassName || "h-6 w-6 text-white"} />
//         <input type="file" className="hidden" onChange={onChange} accept="image/*" />
//       </label>
//     </div>
//   );
// };

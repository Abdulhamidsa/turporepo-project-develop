export type ProjectType = {
  createdAt: string;
  updatedAt: string;
  url?: string;
  id: string;
  media: {
    url: string;
  }[];
  title: string;
  description: string;
  thumbnail: string;
  tags: {
    id: string;
    name: string;
  }[];
};

export type MediaType = {
  url?: string;
  _id: string;
};

export type AllProjectType = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  url: string;
  media: MediaType[]; // Array of media objects
  thumbnail: string;
  tags: string[]; // Array of tag IDs (as strings)
  createdAt: string; // ISO string for date
  updatedAt: string; // ISO string for date
};

export type GetAllProjectsResponse = {
  success: boolean;
  data: ProjectType[];
};

export interface User {
  friendlyId: string;
  username: string;
  profilePicture: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  media: {
    url: string;
  }[];
  tags: {
    id: string;
    name: string;
  }[];
}
export interface ProjectCardProps {
  project: ProjectType;
  friendlyId: string;
  onClick: () => void;
}
export type AddProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// src/data/types/types.ts
// export interface AddProject {
//   title: string;
//   description: string;
//   url: string;
//   media: string[];
//   thumbnail: string | null;
//   tags: string[];
// }

export type TagInputProps = {
  tags: string[];
  setTags: (tags: string[]) => void;
  error?: string;
};

// types.ts

export interface ImageUploaderProps {
  images: (File | string)[];
  setImages: (images: (File | string)[]) => void;
  isThumbnail?: boolean;
  error?: string;
}

// src/data/types/types.ts
export interface AddProject {
  title: string;
  description: string;
  url: string;
  thumbnail: string; // URL of the thumbnail
  media: string[]; // Array of media URLs
  tags: string[]; // Array of Tag IDs
}
export interface FetchProject {
  id: string; // Project ID
  title: string;
  description: string;
  url: string;
  thumbnail: string; // URL of the thumbnail
  media: { url: string }[]; // Array of media objects with URL
  tags: { id: string; name: string }[]; // Array of Tag objects with ID and name
  createdAt: string; // ISO string for creation timestamp
  updatedAt: string; // ISO string for update timestamp
}

export interface Tag {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  media: { url: string }[];
  thumbnail: string;
  tags: Tag[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Tag {
  id: string;
  name: string;
}

export interface Media {
  url: string;
}

export interface User {
  _id: string;
  username: string;
  profilePicture: string;
  profession: string;
}

// types.ts (or wherever you keep your shared types)

export interface UserType {
  _id: string;
  username: string;
  profilePicture: string | null;
  friendlyId: string;
  profession: string;
}

export type CommentType = {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    username: string;
    profilePicture: string | null;
    friendlyId: string;
  };
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface PostType {
  id: string;
  content: string;
  image: string | null;
  createdAt: string;
  likedByUser: boolean;
  likesCount: number;
  comments: CommentType[];
  userId: UserType;
}

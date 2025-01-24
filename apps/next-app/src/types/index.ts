export interface Tag {
  id: string;
  name: string;
}

export interface Media {
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  media: Media[];
  thumbnail: string;
  tags: Tag[];
  featured?: boolean;
}

export interface User {
  id: string;
  bio: string;
  countryOrigin: string;
  friendlyId: string;
  completedProfile: boolean;
  coverImage: string;
  username: string;
  profilePicture: string;
  profession: string;
  age: number | null;
  createdAt: string;
  updatedAt: string;
  skills: string[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

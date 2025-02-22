export type Tag = {
  id: string;
  name: string;
};

export type Media = {
  url: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  url: string;
  media: Media[];
  thumbnail: string;
  tags: Tag[];
  featured?: boolean;
};

export type User = {
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
};

export type GetUserProjectResponse = {
  success: boolean;
  data: {
    projects: Project[];
    user: User;
  };
};

export type ProjectFeatured = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: { id: string; name: string }[];
  user?: {
    username: string;
    profilePicture?: string;
    profession?: string;
  };
};

export type FeaturedProjectsProps = {
  projects: ProjectFeatured[];
};

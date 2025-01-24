import { useState } from "react";

export function useProjectState(userProfile: { username: string; profilePicture: string }) {
  const [project, setProject] = useState({
    title: "",
    description: "",
    url: "",
    media: [] as string[],
    thumbnail: null as string | null,
    tags: [] as string[],
    user: {
      name: userProfile.username || "Unknown User",
      avatar: userProfile.profilePicture || "/placeholder.png",
    },
  });

  const updateField = (name: string, value: string) => {
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (tag: string) => {
    setProject((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const removeTag = (tagToRemove: string) => {
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addMedia = (urls: string[]) => {
    setProject((prev) => ({
      ...prev,
      media: [...prev.media, ...urls],
    }));
  };

  const removeMedia = (urlToRemove: string) => {
    setProject((prev) => ({
      ...prev,
      media: prev.media.filter((url) => url !== urlToRemove),
    }));
  };

  const updateThumbnail = (url: string) => {
    setProject((prev) => ({ ...prev, thumbnail: url }));
  };

  return {
    project,
    updateField,
    addTag,
    removeTag,
    addMedia,
    removeMedia,
    updateThumbnail,
    reset: () =>
      setProject({
        title: "",
        description: "",
        url: "",
        media: [],
        thumbnail: null,
        tags: [],
        user: project.user,
      }),
  };
}

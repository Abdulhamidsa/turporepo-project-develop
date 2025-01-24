import { useState } from "react";

export function useProjectValidation() {
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    tags: "",
    media: "",
  });

  const validateFields = (project: { title: string; description: string; url: string; thumbnail: string | null; tags: string[]; media: string[] }) => {
    const newErrors = {
      title: project.title.trim() === "" ? "Title is required." : "",
      description: project.description.trim() === "" ? "Description is required." : "",
      url: project.url.trim() === "" ? "Project URL is required." : "",
      thumbnail: !project.thumbnail ? "Thumbnail is required." : "",
      tags: project.tags.length === 0 ? "At least one tag is required." : "",
      media: project.media.length === 0 ? "At least one media file is required." : "",
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return { errors, setErrors, validateFields };
}

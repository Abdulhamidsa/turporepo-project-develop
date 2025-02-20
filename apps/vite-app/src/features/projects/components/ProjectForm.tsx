import React, { useState } from 'react';

import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { AddProjectInput } from '@repo/zod/validation';

import ImageUploader from './ImageUploader';
import SaveButton from './SaveButton';
import TagInput from './TagsInput';

interface ProjectFormProps {
  project: AddProjectInput;
  setProject: React.Dispatch<React.SetStateAction<AddProjectInput>>;
  errors: Record<keyof AddProjectInput, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<keyof AddProjectInput, string>>>;
  pendingThumbnail: File | null;
  setPendingThumbnail: React.Dispatch<React.SetStateAction<File | null>>;
  pendingMedia: File[];
  setPendingMedia: React.Dispatch<React.SetStateAction<File[]>>;
  saveProject: () => Promise<boolean>;
  loading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  setProject,
  errors,
  setErrors,
  pendingThumbnail,
  setPendingThumbnail,
  pendingMedia,
  setPendingMedia,
  saveProject,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSaveProject = async () => {
    try {
      setProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsUploading(true);
      setProgress(30);

      const success: boolean = await saveProject();

      if (success) {
        setProgress(70);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        setProgress(0);
      }

      setIsUploading(false);
    } catch (error) {
      console.error('Failed to save project:', error);
      setProgress(0);
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (tags: string[]) => {
    if (tags.length > 5) {
      setErrors((prev) => ({ ...prev, tags: 'You can only add up to 5 tags.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, tags: '' }));
    setProject((prev) => ({ ...prev, tags }));
  };

  return (
    <div className="bg-card overflow-y-auto rounded-[var(--radius)] p-6 shadow-lg">
      <h3 className="text-foreground mb-6 text-xl font-bold">Upload Your Project</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-foreground">
            Project Title
          </Label>
          <Input
            id="title"
            name="title"
            value={project.title || ''}
            onChange={handleInputChange}
            className={`bg-input text-foreground border-border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={project.description || ''}
            onChange={handleInputChange}
            className={`bg-input text-foreground border-border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={4}
          />
          {errors.description && (
            <p className="text-destructive mt-1 text-sm">{errors.description}</p>
          )}
        </div>

        <ImageUploader
          images={
            pendingThumbnail ? [pendingThumbnail] : project.thumbnail ? [project.thumbnail] : []
          }
          setImages={(files) =>
            setPendingThumbnail(files.length > 0 && files[0] instanceof File ? files[0] : null)
          }
          isThumbnail
          error={errors.thumbnail}
        />

        <ImageUploader
          images={pendingMedia.length > 0 ? pendingMedia : (project.media || []).map((m) => m.url)}
          setImages={(files) =>
            setPendingMedia(files.filter((file): file is File => file instanceof File))
          }
          error={errors.media}
        />

        <TagInput tags={project.tags || []} setTags={handleTagsChange} error={errors.tags} />

        {/* Save Button + Progress Bar */}
        <div className="mt-6">
          <SaveButton onClick={handleSaveProject} loading={isUploading} progress={progress} />
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;

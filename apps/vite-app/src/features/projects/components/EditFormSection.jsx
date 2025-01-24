import { Input, Textarea, Button, Label, Badge } from "../UI";

const EditFormSection = ({ project, errors, handleInputChange, handleImageUpload, handleTagInput, removeTag, removeImage, saveProject, loading }) => {
  return (
    <div className="p-6 rounded-r-lg overflow-y-auto">
      <h3 className="text-xl font-bold text-foreground mb-12">Upload your project</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input id="title" name="title" value={project.title} onChange={handleInputChange} />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={project.description} onChange={handleInputChange} />
          {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
        </div>
        <div>
          <Label htmlFor="url">Project URL</Label>
          <Input id="url" name="url" value={project.url} onChange={handleInputChange} />
          {errors.url && <p className="text-sm text-destructive mt-1">{errors.url}</p>}
        </div>
        <div>
          <Label>Project Thumbnail</Label>
          <Input type="file" onChange={(e) => handleImageUpload(e, true)} accept="image/*" />
          {errors.thumbnail && <p className="text-sm text-destructive mt-1">{errors.thumbnail}</p>}
        </div>
        <div>
          <Label>Project Images</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {project.media.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Project image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                <button onClick={() => removeImage(image)} className="absolute top-1 right-1">
                  X
                </button>
              </div>
            ))}
            <label className="w-full h-24 flex items-center justify-center">
              +
              <Input type="file" onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
            </label>
          </div>
          {errors.media && <p className="text-sm text-destructive mt-1">{errors.media}</p>}
        </div>
        <div>
          <Label htmlFor="tags">Tags (Press Enter to add)</Label>
          <Input id="tags" onKeyDown={handleTagInput} />
          {errors.tags && <p className="text-sm text-destructive mt-1">{errors.tags}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {project.tags.map((tag) => (
              <Badge key={tag}>
                {tag}
                <button onClick={() => removeTag(tag)}>X</button>
              </Badge>
            ))}
          </div>
        </div>
        <Button onClick={saveProject} disabled={loading}>
          {loading ? "Saving..." : "Save Project"}
        </Button>
      </div>
    </div>
  );
};

export default EditFormSection;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PostFormFields } from "@/components/admin/PostFormFields";
import { PostFormActions } from "@/components/admin/PostFormActions";
import type { PostFormData, PostFormProps } from "@/types/post";

const PostForm = ({ defaultValues, onSubmit, onCancel, onPreview, isPreviewLoading }: PostFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<PostFormData>({
    title: defaultValues?.title || "",
    content: defaultValues?.content || "",
    excerpt: defaultValues?.excerpt || "",
    status: defaultValues?.status || "draft",
    metaTitle: defaultValues?.metaTitle || "",
    metaDescription: defaultValues?.metaDescription || "",
    featuredImage: defaultValues?.featuredImage || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData, newImage);
    } catch (error) {
      console.error("Failed to save post:", error);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file: File) => {
    setNewImage(file);
    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, featuredImage: previewUrl }));
  };

  const handlePreview = async () => {
    if (onPreview) {
      try {
        await onPreview(formData);
      } catch (error) {
        console.error("Preview failed:", error);
        toast.error("Failed to generate preview");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PostFormFields
        {...formData}
        isSubmitting={isSubmitting}
        onTitleChange={handleFieldChange("title")}
        onContentChange={handleFieldChange("content")}
        onExcerptChange={handleFieldChange("excerpt")}
        onStatusChange={handleFieldChange("status")}
        onMetaTitleChange={handleFieldChange("metaTitle")}
        onMetaDescriptionChange={handleFieldChange("metaDescription")}
        onFeaturedImageChange={handleFieldChange("featuredImage")}
        onImageUpload={handleImageUpload}
      />
      <PostFormActions 
        isSubmitting={isSubmitting} 
        onCancel={onCancel}
        onPreview={handlePreview}
        isPreviewLoading={isPreviewLoading}
      />
    </form>
  );
};

export default PostForm;
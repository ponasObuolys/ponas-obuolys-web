import { Database } from "@/integrations/supabase/types";

export type PostStatus = Database["public"]["Enums"]["post_status"];

export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
}

export const mapDatabaseToFormData = (dbData: Database["public"]["Tables"]["posts"]["Row"]): PostFormData => {
  return {
    title: dbData.title,
    content: dbData.content || "",
    excerpt: dbData.excerpt || "",
    status: dbData.status || "draft",
    metaTitle: dbData.meta_title || "",
    metaDescription: dbData.meta_description || "",
    featuredImage: dbData.featured_image || "",
  };
};

export const mapFormToDatabase = (formData: PostFormData) => {
  return {
    title: formData.title,
    content: formData.content,
    excerpt: formData.excerpt,
    status: formData.status,
    meta_title: formData.metaTitle,
    meta_description: formData.metaDescription,
    featured_image: formData.featuredImage,
  };
};
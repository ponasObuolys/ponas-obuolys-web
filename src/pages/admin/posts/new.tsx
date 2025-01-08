import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import AdminLayout from "@/components/admin/Layout";
import PostForm from "@/components/editor/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PostFormData } from "@/types/post";

export default function NewPost() {
  const navigate = useNavigate();
  const session = useSession();
  
  const initialFormData: PostFormData = {
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
  };

  const handleSubmit = async (data: PostFormData, newImage: File | null) => {
    if (!session?.user?.id) {
      toast.error("Turite būti prisijungęs");
      return;
    }

    try {
      let imageUrl = data.featuredImage;
      
      if (newImage) {
        const fileExt = newImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-media')
          .upload(filePath, newImage);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('blog-media')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }

      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const postData = {
        ...data,
        slug,
        featured_image: imageUrl,
        author_id: session.user.id,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) throw error;

      toast.success("Įrašas sėkmingai sukurtas");
      navigate("/admin");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Nepavyko sukurti įrašo");
      throw error;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Naujas įrašas</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <PostForm
            defaultValues={initialFormData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin")}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
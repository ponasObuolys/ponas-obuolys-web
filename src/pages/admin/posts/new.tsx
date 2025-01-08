import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import AdminLayout from "@/components/admin/Layout";
import PostForm from "@/components/editor/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export default function NewPost() {
  const navigate = useNavigate();
  const session = useSession();
  
  const defaultValues = {
    title: "",
    content: "",
    excerpt: "",
    status: "draft" as const,
    meta_title: "",
    meta_description: "",
    featured_image: "",
  };

  const handleSubmit = async (data: any) => {
    if (!session?.user?.id) return;

    try {
      const slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const postData = {
        ...data,
        slug,
        author_id: session.user.id,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      navigate("/admin");
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Naujas įrašas</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PostForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigation } from "@/components/Navigation";
import PostForm from "@/components/editor/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostFormData, mapDatabaseToFormData, mapFormToDatabase } from "@/types/post";
import { slugify } from "@/utils/slugify";

const PostEditor = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<PostFormData>({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featuredImage: "",
  });

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else if (!roleLoading && role !== "admin") {
      navigate("/");
    }
  }, [session, navigate, role, roleLoading]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching post with ID:", id);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching post:", error);
          setError("Failed to fetch post. Please try again.");
          toast.error("Failed to fetch post. Please try again.");
          return;
        }

        if (data) {
          console.log("Post data retrieved:", data);
          setDefaultValues(mapDatabaseToFormData(data));
        } else {
          console.log("No post found with ID:", id);
          toast.error("Post not found");
          navigate("/admin");
        }
      } catch (err) {
        console.error("Error in fetchPost:", err);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleSave = async (data: PostFormData, newImage: File | null) => {
    try {
      setError(null);
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

      const slug = slugify(data.title);

      const postData = {
        ...mapFormToDatabase(data),
        slug,
        featured_image: imageUrl,
        author_id: session?.user?.id,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      };

      const { error: saveError } = id
        ? await supabase.from("posts").update(postData).eq("id", id)
        : await supabase.from("posts").insert(postData);

      if (saveError) throw saveError;

      toast.success("Post saved successfully.");
      navigate("/admin");
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save post. Please try again.');
      toast.error('Failed to save post. Please try again.');
      throw err;
    }
  };

  if (loading || !session || role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? "Edit Post" : "New Post"}
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <PostForm
          defaultValues={defaultValues}
          onSubmit={handleSave}
          onCancel={() => navigate("/admin")}
        />
      </div>
    </div>
  );
};

export default PostEditor;
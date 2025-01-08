import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserRole } from "@/hooks/useUserRole";
import Navigation from "@/components/Navigation";
import PostForm from "@/components/editor/PostForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostFormData, mapDatabaseToFormData, mapFormToDatabase } from "@/types/post";

const PostEditor = () => {
  const { id } = useParams();
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const [loading, setLoading] = useState(true);
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
      if (id) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          toast.error("Failed to fetch post. Please try again.");
          return;
        }

        if (data) {
          setDefaultValues(mapDatabaseToFormData(data));
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const onSubmit = async (data: PostFormData) => {
    if (!session?.user?.id) return;

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const postData = {
      ...mapFormToDatabase(data),
      slug,
      author_id: session.user.id,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };

    const { error } = id
      ? await supabase.from("posts").update(postData).eq("id", id)
      : await supabase.from("posts").insert(postData);

    if (error) {
      toast.error("Failed to save post. Please try again.");
      return;
    }

    toast.success("Post saved successfully.");
    navigate("/admin");
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
        <PostForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => navigate("/admin")}
        />
      </div>
    </div>
  );
};

export default PostEditor;
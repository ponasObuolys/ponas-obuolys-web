import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostForm from "@/components/editor/PostForm";
import { useNavigate } from "react-router-dom";
import { PostFormData } from "@/types/post";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSave = async (data: PostFormData, newImage: File | null) => {
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

      const postData = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        featured_image: imageUrl,
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) throw error;

      toast.success("Naujiena išsaugota");
      navigate("/admin");
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Nepavyko išsaugoti naujienos');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {id ? "Redaguoti naujieną" : "Nauja naujiena"}
        </h1>
        <PostForm
          onSubmit={handleSave}
          onCancel={() => navigate("/admin")}
        />
      </div>
    </div>
  );
};

export default Editor;
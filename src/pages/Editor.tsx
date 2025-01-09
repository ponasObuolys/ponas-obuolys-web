import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import PostForm from "@/components/editor/PostForm";
import { PostFormData } from "@/types/post";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { slugify } from "@/utils/slugify";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const session = useSession();

  const handleSave = async (data: PostFormData, newImage: File | null) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Turite būti prisijungęs');
        return;
      }

      let imageUrl = data.featuredImage;
      
      if (newImage) {
        try {
          const fileExt = newImage.name.split('.').pop();
          const filePath = `${crypto.randomUUID()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('blog-media')
            .upload(filePath, newImage, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast.error('Nepavyko įkelti paveikslėlio');
            return;
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('blog-media')
            .getPublicUrl(filePath);
            
          imageUrl = publicUrl;
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          toast.error('Nepavyko įkelti paveikslėlio');
          return;
        }
      }

      const slug = slugify(data.title);

      const postData = {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        status: data.status,
        meta_title: data.metaTitle,
        meta_description: data.metaDescription,
        featured_image: imageUrl,
        author_id: user.id
      };

      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) {
        console.error('Error saving post:', error);
        toast.error('Nepavyko išsaugoti naujienos');
        return;
      }

      toast.success("Naujiena išsaugota");
      navigate("/admin");
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Nepavyko išsaugoti naujienos');
    }
  };

  const handlePreview = async (data: PostFormData) => {
    try {
      setIsPreviewLoading(true);
      const slug = slugify(data.title);
      navigate(`/naujienos/${slug}`);
    } catch (err) {
      console.error('Preview failed:', err);
      toast.error('Nepavyko atidaryti peržiūros');
    } finally {
      setIsPreviewLoading(false);
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
          onPreview={handlePreview}
          isPreviewLoading={isPreviewLoading}
        />
      </div>
    </div>
  );
};

export default Editor;
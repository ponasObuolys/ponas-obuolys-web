import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/Layout";
import CourseForm from "@/components/admin/courses/CourseForm";
import { supabase } from "@/integrations/supabase/client";
import type { CourseFormData } from "@/types/course";

export default function NewCoursePage() {
  const navigate = useNavigate();
  const session = useSession();

  const handleSubmit = async (data: CourseFormData, thumbnail: File | null) => {
    if (!session?.user?.id) {
      toast.error("Turite būti prisijungęs");
      return;
    }

    try {
      let thumbnailUrl = data.thumbnail;
      
      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("course-content")
          .upload(filePath, thumbnail);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("course-content")
          .getPublicUrl(filePath);
          
        thumbnailUrl = publicUrl;
      }

      const { error } = await supabase.from("courses").insert({
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        thumbnail: thumbnailUrl,
        author_id: session.user.id,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      });

      if (error) throw error;
      
      toast.success("Kursas sėkmingai sukurtas");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Nepavyko sukurti kurso");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Naujas kursas</h1>
        <CourseForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
}
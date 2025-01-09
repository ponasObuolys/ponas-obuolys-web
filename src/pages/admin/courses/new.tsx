import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import AdminLayout from "@/components/admin/Layout";
import CourseForm from "@/components/admin/courses/CourseForm";
import { supabase } from "@/integrations/supabase/client";
import type { CourseFormData } from "@/types/course";

export default function NewCoursePage() {
  const navigate = useNavigate();
  const session = useSession();

  const handleSubmit = async (data: CourseFormData, thumbnail: File | null) => {
    if (!session?.user?.id) return;

    let thumbnailUrl = "";
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
    });

    if (error) throw error;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Naujas kursas</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <CourseForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/courses")}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
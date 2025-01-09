import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/Layout";
import CourseForm from "@/components/admin/courses/CourseForm";
import CourseContent from "@/components/admin/courses/CourseContent";
import { supabase } from "@/integrations/supabase/client";
import type { CourseFormData } from "@/types/course";

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (data: CourseFormData, thumbnail: File | null) => {
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

    const { error } = await supabase
      .from("courses")
      .update({
        title: data.title,
        description: data.description,
        price: data.price,
        currency: data.currency,
        thumbnail: thumbnailUrl,
      })
      .eq("id", id);

    if (error) throw error;
  };

  if (isLoading) return null;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Redaguoti kursą</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <CourseForm
            defaultValues={course as CourseFormData}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/courses")}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <CourseContent />
        </div>
      </div>
    </AdminLayout>
  );
}
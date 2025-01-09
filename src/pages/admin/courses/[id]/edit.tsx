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
        .select(`
          *,
          course_categories!inner(
            categories(*)
          ),
          course_tags!inner(
            tags(*)
          )
        `)
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
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
      })
      .eq("id", id);

    if (error) throw error;
  };

  if (isLoading) return null;

  // Transform database course to form data
  const formData: CourseFormData = {
    title: course?.title || "",
    description: course?.description || "",
    price: course?.price || 0,
    currency: course?.currency || "EUR",
    thumbnail: course?.thumbnail || "",
    categories: course?.course_categories?.map(cc => cc.categories.id) || [],
    tags: course?.course_tags?.map(ct => ct.tags.id) || [],
    start_date: course?.start_date ? new Date(course.start_date) : new Date(),
    end_date: course?.end_date ? new Date(course.end_date) : new Date(),
    status: course?.status || "upcoming"
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Redaguoti kursą</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <CourseForm
            defaultValues={formData}
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
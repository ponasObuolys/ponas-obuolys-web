import AdminLayout from "@/components/admin/Layout";
import CourseForm from "@/components/admin/courses/CourseForm";

export default function NewCoursePage() {
  const handleCancel = () => {
    window.history.back();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Naujas kursas</h1>
        <CourseForm onCancel={handleCancel} />
      </div>
    </AdminLayout>
  );
}
import AdminLayout from "@/components/admin/Layout";
import CourseList from "@/components/admin/courses/CourseList";

export default function CoursesPage() {
  return (
    <AdminLayout>
      <CourseList />
    </AdminLayout>
  );
}
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/Layout";
import PostForm from "@/components/editor/PostForm";

export default function NewPost() {
  const navigate = useNavigate();
  
  const defaultValues = {
    title: "",
    content: "",
    excerpt: "",
    status: "draft" as const,
    meta_title: "",
    meta_description: "",
    featured_image: "",
  };

  const handleSubmit = async (data: any) => {
    // Handle form submission logic here
  };

  const handleCancel = () => {
    navigate("/admin");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Naujas įrašas</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PostForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

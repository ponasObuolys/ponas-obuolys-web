import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostsTable } from "@/components/admin/PostsTable";

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading } = useUserRole();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else if (!loading && role !== "admin") {
      navigate("/");
    }
  }, [session, navigate, role, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={() => navigate("/admin/posts/new")}>
          <Plus className="mr-2" />
          New Post
        </Button>
      </div>
      <PostsTable />
    </div>
  );
};

export default Dashboard;
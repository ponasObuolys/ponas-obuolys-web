import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard, usePostStats } from "@/components/admin/StatsCard";
import { PostsTable } from "@/components/admin/PostsTable";
import AdminLayout from "@/components/admin/Layout";
import { lt } from "@/i18n/lt";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading } = useUserRole();
  const { data: stats } = usePostStats();

  useEffect(() => {
    console.log("Admin: Session and role check", { session, role, loading });
    if (!session) {
      navigate("/auth");
    } else if (!loading && role !== "admin") {
      navigate("/");
    }
  }, [session, navigate, role, loading]);

  const handleNewPost = () => {
    console.log("Navigating to editor for new post");
    navigate("/editor");
  };

  if (loading || !session || role !== "admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Naujienų valdymas</h1>
          <Button onClick={handleNewPost} className="shadow-sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            {lt.admin.newPost}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title={lt.admin.totalPosts}
            value={stats?.totalPosts || 0}
            description="Visi blog'o įrašai"
          />
          <StatsCard
            title={lt.admin.published}
            value={stats?.publishedPosts || 0}
            description="Aktyvūs įrašai"
          />
          <StatsCard
            title={lt.admin.drafts}
            value={stats?.draftPosts || 0}
            description="Nepaskelbti įrašai"
          />
          <StatsCard
            title={lt.admin.totalViews}
            value={stats?.totalViews || 0}
            description="Bendros peržiūros"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <PostsTable />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { PostsTable } from "@/components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard, usePostStats } from "@/components/admin/StatsCard";
import { lt } from "@/i18n/lt";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading } = useUserRole();
  const { data: stats } = usePostStats();

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    } else if (!loading && role !== "admin") {
      navigate("/");
    }
  }, [session, navigate, role, loading]);

  const handleNewPost = () => {
    navigate("/admin/posts/new");
  };

  if (loading || !session || role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{lt.admin.title}</h1>
          <Button onClick={handleNewPost} className="shadow-sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            {lt.admin.newPost}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="bg-white rounded-lg shadow-sm border">
          <PostsTable />
        </div>
      </div>
    </div>
  );
};

export default Admin;
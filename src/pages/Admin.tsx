import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { PostsTable } from "@/components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { StatsCard, usePostStats } from "@/components/admin/StatsCard";

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

  if (loading || !session || role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <Button onClick={() => navigate("/admin/posts/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Posts"
            value={stats?.totalPosts || 0}
            description="All blog posts"
          />
          <StatsCard
            title="Published"
            value={stats?.publishedPosts || 0}
            description="Live posts"
          />
          <StatsCard
            title="Drafts"
            value={stats?.draftPosts || 0}
            description="Unpublished posts"
          />
          <StatsCard
            title="Total Views"
            value={stats?.totalViews || 0}
            description="All time views"
          />
        </div>

        <PostsTable />
      </div>
    </div>
  );
};

export default Admin;
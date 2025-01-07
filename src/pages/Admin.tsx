import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Navigation from "@/components/Navigation";
import { PostsTable } from "@/components/admin/PostsTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { role, loading } = useUserRole();

  const { data: stats } = useQuery({
    queryKey: ["post-stats"],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from("posts")
        .select("status, views_count");

      if (error) throw error;

      const totalPosts = posts.length;
      const publishedPosts = posts.filter(
        (post) => post.status === "published"
      ).length;
      const draftPosts = posts.filter(
        (post) => post.status === "draft"
      ).length;
      const totalViews = posts.reduce(
        (sum, post) => sum + (post.views_count || 0),
        0
      );

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
      };
    },
  });

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
          <Card>
            <CardHeader>
              <CardTitle>Total Posts</CardTitle>
              <CardDescription>All blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalPosts || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Published</CardTitle>
              <CardDescription>Live posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.publishedPosts || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>Unpublished posts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.draftPosts || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Views</CardTitle>
              <CardDescription>All time views</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
            </CardContent>
          </Card>
        </div>

        <PostsTable />
      </div>
    </div>
  );
};

export default Admin;
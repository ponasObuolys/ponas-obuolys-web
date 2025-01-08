import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardProps {
  title: string;
  value: number;
  description: string;
}

export const StatsCard = ({ title, value, description }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export const usePostStats = () => {
  return useQuery({
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
      const draftPosts = posts.filter((post) => post.status === "draft").length;
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
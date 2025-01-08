import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  status: "draft" | "published" | "scheduled";
  created_at: string;
  published_at: string | null;
  views_count: number;
  author: {
    id: string;
    username: string | null;
  };
}

export const PostsTable = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      console.log("Fetching posts with author information...");
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          status,
          created_at,
          published_at,
          views_count,
          author:profiles(id, username)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Fetched posts:", data);
      return data as Post[];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post");
      return;
    }
    toast.success("Post deleted successfully");
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!posts) {
    return <div>No posts found</div>;
  }

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Views</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Published</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.author?.username || "Unknown"}</TableCell>
            <TableCell>
              <Badge variant={getStatusColor(post.status)}>
                {post.status}
              </Badge>
            </TableCell>
            <TableCell>{post.views_count}</TableCell>
            <TableCell>
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              {post.published_at
                ? format(new Date(post.published_at), "MMM d, yyyy")
                : "-"}
            </TableCell>
            <TableCell className="space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/admin/posts/${post.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(post.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
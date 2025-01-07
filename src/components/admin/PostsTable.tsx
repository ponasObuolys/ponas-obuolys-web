import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { lt } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: string;
  title: string;
  status: "draft" | "published" | "scheduled";
  created_at: string;
  published_at: string | null;
  author: {
    email: string;
  } | null;
};

export const PostsTable = () => {
  const navigate = useNavigate();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      console.log("Fetching posts for admin dashboard...");
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          status,
          created_at,
          published_at,
          author:author_id(email)
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

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  const getStatusColor = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "secondary";
      case "scheduled":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(post.status)}>
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>{post.author?.email}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: lt,
                })}
              </TableCell>
              <TableCell>
                {post.published_at
                  ? formatDistanceToNow(new Date(post.published_at), {
                      addSuffix: true,
                      locale: lt,
                    })
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
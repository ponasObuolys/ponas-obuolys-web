import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Search, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ITEMS_PER_PAGE = 10;

export const PostsTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: postsData, isLoading, refetch } = useQuery({
    queryKey: ["posts", search, statusFilter, page],
    queryFn: async () => {
      console.log("Fetching posts with filters:", { search, statusFilter, page });
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      let query = supabase
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
        .order("created_at", { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error, count } = await query.select("*", { count: "exact" });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Fetched posts:", data);
      return {
        posts: data as Post[],
        total: count || 0,
      };
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

  const totalPages = postsData ? Math.ceil(postsData.total / ITEMS_PER_PAGE) : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          {postsData?.posts.map((post) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
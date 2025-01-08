import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostsTableHeader } from "./PostsTableHeader";
import { PostsTableRow } from "./PostsTableRow";
import { Post } from "./types";

const ITEMS_PER_PAGE = 10;

export const PostsTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const { data: postsData, isLoading, refetch } = useQuery({
    queryKey: ["posts", search, statusFilter, page],
    queryFn: async () => {
      console.log("Fetching posts with filters:", { search, statusFilter, page });
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      let query = supabase
        .from("posts")
        .select(
          `
          id,
          title,
          status,
          created_at,
          published_at,
          views_count,
          author:profiles(id, username)
        `
        )
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

  const handleBulkAction = async (action: string) => {
    if (!selectedPosts.length) return;

    switch (action) {
      case "publish":
        await supabase
          .from("posts")
          .update({ status: "published", published_at: new Date().toISOString() })
          .in("id", selectedPosts);
        break;
      case "draft":
        await supabase
          .from("posts")
          .update({ status: "draft", published_at: null })
          .in("id", selectedPosts);
        break;
      case "delete":
        await supabase.from("posts").delete().in("id", selectedPosts);
        break;
    }

    setSelectedPosts([]);
    refetch();
    toast.success(`Bulk action "${action}" completed successfully`);
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
      <PostsTableHeader
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        selectedPosts={selectedPosts}
        onBulkAction={handleBulkAction}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
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
            <PostsTableRow
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onNavigate={navigate}
              selected={selectedPosts.includes(post.id)}
              onSelect={(id, checked) => {
                setSelectedPosts((prev) =>
                  checked
                    ? [...prev, id]
                    : prev.filter((postId) => postId !== id)
                );
              }}
            />
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
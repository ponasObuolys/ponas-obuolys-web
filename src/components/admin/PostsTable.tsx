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
import { PostsTableRow } from "./PostsTableRow";
import { PostFilters } from "./PostFilters";
import { PostBulkActions } from "./PostBulkActions";
import { PostPagination } from "./PostPagination";
import { usePostsData } from "./usePostsData";
import type { Post, PostFilters as PostFiltersType } from "./types";

const ITEMS_PER_PAGE = 10;

export const PostsTable = () => {
  const navigate = useNavigate();
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [filters, setFilters] = useState<PostFiltersType>({
    search: "",
    status: "all",
    page: 1,
  });

  const { data: postsData, isLoading, refetch } = usePostsData(filters);

  const handleDelete = async (id: string) => {
    try {
      console.log("Deleting post with ID:", id);
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Post deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleStatusChange = async (postId: string, newStatus: Post["status"]) => {
    try {
      console.log("Updating post status:", { postId, newStatus });
      const { error } = await supabase
        .from("posts")
        .update({ 
          status: newStatus,
          published_at: newStatus === "published" ? new Date().toISOString() : null 
        })
        .eq("id", postId);
      
      if (error) throw error;
      
      toast.success(`Post status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedPosts.length) return;

    try {
      console.log("Performing bulk action:", { action, selectedPosts });
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
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error("Failed to perform bulk action");
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
      <div className="flex items-center justify-between gap-4">
        <PostFilters
          filters={filters}
          onFiltersChange={(newFilters) =>
            setFilters((prev) => ({ ...prev, ...newFilters }))
          }
        />
        <PostBulkActions
          selectedPosts={selectedPosts}
          onBulkAction={handleBulkAction}
        />
      </div>

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
              onStatusChange={handleStatusChange}
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

      <PostPagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
};
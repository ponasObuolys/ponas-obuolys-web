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
import { PostsTableRow } from "./PostsTableRow";
import { PostFilters } from "./PostFilters";
import { PostBulkActions } from "./PostBulkActions";
import { PostPagination } from "./PostPagination";
import { Post, PostFilters as PostFiltersType } from "./types";

const ITEMS_PER_PAGE = 10;

export const PostsTable = () => {
  const navigate = useNavigate();
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [filters, setFilters] = useState<PostFiltersType>({
    search: "",
    status: "all",
    page: 1,
  });

  const { data: postsData, isLoading, refetch } = useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      console.log("Fetching posts with filters:", filters);
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
        .range(
          (filters.page - 1) * ITEMS_PER_PAGE,
          filters.page * ITEMS_PER_PAGE - 1
        );

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      if (filters.status !== "all") {
        query = query.eq("status", filters.status as Post["status"]);
      }

      const { data, error } = await query;
      const { count } = await query.count();

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Fetched posts:", data);
      
      const transformedPosts = data.map((post: any) => ({
        ...post,
        author: {
          id: post.author?.id || "",
          username: post.author?.username || "Unknown",
        },
      })) as Post[];

      return {
        posts: transformedPosts,
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

  const handleStatusChange = (postId: string) => async (newStatus: Post["status"]) => {
    try {
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
              onStatusChange={handleStatusChange(post.id)}
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
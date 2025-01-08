import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Post, PostFilters, PostStatus } from "./types";

const ITEMS_PER_PAGE = 10;

export const usePostsData = (filters: PostFilters) => {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      console.log("Fetching posts with filters:", filters);
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
        `,
          { count: 'exact' }
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
        query = query.eq("status", filters.status as PostStatus);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to fetch posts");
        throw error;
      }

      return {
        posts: data as Post[],
        total: count || 0,
      };
    },
  });
};
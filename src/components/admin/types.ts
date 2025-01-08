import { Database } from "@/integrations/supabase/types";

export type Post = {
  id: string;
  title: string;
  status: Database["public"]["Enums"]["post_status"];
  created_at: string;
  published_at: string | null;
  views_count: number;
  author: {
    id: string;
    username: string | null;
  };
};

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export interface PostFilters {
  search: string;
  status: string;
  page: number;
}

export interface BulkActionProps {
  selectedPosts: string[];
  onBulkAction: (action: string) => Promise<void>;
}
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

export interface PostTableProps {
  post: Post;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onStatusChange: (postId: string, newStatus: Post["status"]) => void;
  onDelete: (id: string) => void;
  onNavigate: (path: string) => void;
}

export interface PostFiltersProps {
  filters: PostFilters;
  onFiltersChange: (filters: Partial<PostFilters>) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
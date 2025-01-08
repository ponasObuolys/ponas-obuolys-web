export interface Post {
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

export interface PostStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}
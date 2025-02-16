import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { BookmarkButton } from "@/components/BookmarkButton";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string | null;
  published_at: string;
  author: {
    username: string | null;
  }[];
}

interface RelatedPostsProps {
  currentPostId: string;
  categoryIds: string[];
}

export function RelatedPosts({ currentPostId, categoryIds }: RelatedPostsProps) {
  const { data: relatedPosts, isLoading } = useQuery<Post[]>({
    queryKey: ["related-posts", currentPostId, categoryIds],
    queryFn: async () => {
      if (!categoryIds.length) return [];

      // First, get post IDs from the same categories
      const { data: postIds, error: postIdsError } = await supabase
        .from("post_categories")
        .select("post_id")
        .in("category_id", categoryIds)
        .neq("post_id", currentPostId);

      if (postIdsError) throw postIdsError;

      if (!postIds.length) return [];

      // Then, get the actual posts
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          excerpt,
          slug,
          featured_image,
          published_at,
          author:profiles(username)
        `)
        .eq("status", "published")
        .in("id", postIds.map(p => p.post_id))
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: categoryIds.length > 0,
  });

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Card key={n} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!relatedPosts?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Susiję straipsniai</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="h-full group transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link to={`/blog/${post.slug}`} className="block">
              {post.featured_image && (
                <div className="aspect-video">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <div onClick={(e) => e.preventDefault()}>
                    <BookmarkButton postId={post.id} />
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                  <span>{formatLithuanianDate(post.published_at)}</span>
                  {post.author?.[0]?.username && (
                    <>
                      <span>•</span>
                      <span>{post.author[0].username}</span>
                    </>
                  )}
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
              )}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
} 
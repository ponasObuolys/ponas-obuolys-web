import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string | null;
  published_at: string;
  author: Array<{
    username: string | null;
  }>;
}

interface BookmarkedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  posts: Post;
}

interface RawBookmarkedPost extends Omit<BookmarkedPost, 'posts'> {
  posts: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    featured_image: string | null;
    published_at: string;
    author: Array<{ username: string | null; }> | { username: string | null; };
  };
}

export default function Bookmarks() {
  const { user } = useAuth();

  const { data: bookmarkedPosts, isLoading } = useQuery<BookmarkedPost[]>({
    queryKey: ["bookmarked-posts"],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          id,
          user_id,
          post_id,
          created_at,
          posts (
            id,
            title,
            excerpt,
            slug,
            featured_image,
            published_at,
            author:profiles(username)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rawPosts = data as RawBookmarkedPost[];
      return rawPosts.map(item => ({
        ...item,
        posts: {
          ...item.posts,
          author: Array.isArray(item.posts.author) ? item.posts.author : [item.posts.author]
        }
      }));
    },
    enabled: !!user,
  });

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Išsaugoti straipsniai</h1>
          <p className="text-muted-foreground mb-8">
            Norėdami matyti išsaugotus straipsnius, turite būti prisijungę
          </p>
          <Button asChild>
            <Link to="/login">Prisijungti</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col space-y-8">
        <h1 className="text-4xl font-bold">Išsaugoti straipsniai</h1>

        {isLoading ? (
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
        ) : !bookmarkedPosts || bookmarkedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Neturite išsaugotų straipsnių</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bookmarkedPosts.map((bookmark) => (
              <Card key={bookmark.id} className="h-full">
                {bookmark.posts.featured_image && (
                  <div className="aspect-video">
                    <img
                      src={bookmark.posts.featured_image}
                      alt={bookmark.posts.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="line-clamp-2">{bookmark.posts.title}</CardTitle>
                    <BookmarkButton postId={bookmark.posts.id} />
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                    <span>{formatLithuanianDate(bookmark.posts.published_at)}</span>
                    {bookmark.posts.author?.[0]?.username && (
                      <>
                        <span>•</span>
                        <span>{bookmark.posts.author[0].username}</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                {bookmark.posts.excerpt && (
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {bookmark.posts.excerpt}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
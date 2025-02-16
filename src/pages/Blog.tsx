import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 12;

interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string | null;
  published_at: string;
  author: {
    username: string | null;
  } | null;
}

interface PageData {
  posts: Post[];
  nextPage: number | null;
}

interface PostResponse {
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

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { ref: loadMoreRef, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<PageData>({
    queryKey: ["published-posts", searchQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      console.log("Fetching published blog posts...");
      const startIndex = (pageParam as number) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE - 1;

      let query = supabase
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
        .order("published_at", { ascending: false })
        .range(startIndex, endIndex);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      const posts = (data as PostResponse[]).map(post => ({
        ...post,
        author: post.author?.[0] || null
      }));

      return {
        posts,
        nextPage: posts.length === POSTS_PER_PAGE ? (pageParam as number) + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Naujienos</h1>
        
        <div className="w-full max-w-2xl">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Ieškoti straipsnių..."
          />
        </div>

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
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
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
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                        <span>
                          {formatLithuanianDate(post.published_at)}
                        </span>
                        {post.author?.username && (
                          <>
                            <span>•</span>
                            <span>{post.author.username}</span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    {post.excerpt && (
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div
              ref={loadMoreRef}
              className="flex justify-center py-8"
            >
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Kraunama daugiau...</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
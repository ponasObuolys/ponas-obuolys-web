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
import { Newsletter } from "@/components/Newsletter";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BookmarkButton } from "@/components/BookmarkButton";

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

interface SubQuery {
  from: (table: string) => SubQuery;
  select: (columns: string) => SubQuery;
  eq: (column: string, value: string) => SubQuery;
  inner_join: (table: string, condition: Record<string, string>) => SubQuery;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { ref: loadMoreRef, inView } = useInView();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<PageData>({
    queryKey: ["published-posts", searchQuery, selectedCategory],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startIndex = (pageParam as number) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE - 1;

      // First, let's try a simple query to get all published posts
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
        .order("published_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
      }

      // Only add category filtering if a category is selected
      if (selectedCategory) {
        const { data: postIds } = await supabase
          .from("post_categories")
          .select(`
            post_id,
            categories!inner (
              slug
            )
          `)
          .eq("categories.slug", selectedCategory);

        if (postIds?.length) {
          query = query.in("id", postIds.map(p => p.post_id));
        } else {
          // If no posts found in category, return empty result
          return {
            posts: [],
            nextPage: null,
          };
        }
      }

      const { data: postsData, error } = await query.range(startIndex, endIndex);

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      const posts = (postsData as PostResponse[]).map(post => ({
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
        
        <div className="flex flex-col space-y-4">
          <div className="w-full max-w-2xl">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Ieškoti straipsnių..."
            />
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
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
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    )}
                  </Link>
                </Card>
              ))}
            </div>

            {/* Newsletter Section */}
            <div className="my-12">
              <Newsletter />
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
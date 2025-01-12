import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { Link } from "react-router-dom";

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

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["published-posts"],
    queryFn: async () => {
      console.log("Fetching published blog posts...");
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
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      return data as Post[];
    },
  });

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dirbtinio intelekto naujienos</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Link key={post.id} to={`/naujienos/${post.slug}`}>
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
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
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
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
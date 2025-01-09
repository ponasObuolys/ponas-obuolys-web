import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { lt } from 'date-fns/locale';

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

export function LatestNews() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["latest-posts"],
    queryFn: async () => {
      console.log("Fetching latest posts for homepage...");
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
        console.error("Error fetching latest posts:", error);
        throw error;
      }

      // Transform the data to set default author if none exists
      return (data as Post[]).map(post => ({
        ...post,
        author: post.author?.username ? post.author : { username: "ponas Obuolys" }
      }));
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Naujienos</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse min-h-[500px]">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Naujienos</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {posts?.map((post) => (
            <Link key={post.id} to={`/naujienos/${post.slug}`}>
              <Card className="min-h-[500px] flex flex-col hover:shadow-lg transition-shadow">
                {post.featured_image && (
                  <div className="aspect-video">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-2 mb-4">
                    <span>{formatLithuanianDate(post.published_at)}</span>
                    <span>•</span>
                    <span>{post.author.username}</span>
                  </div>
                  {post.excerpt && (
                    <p className="text-gray-600 line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  )}
                  <Button className="mt-auto w-full">Skaityti naujieną</Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/naujienos">
              Skaityti visas naujienas
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
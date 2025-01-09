import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { NewsCard } from "./NewsCard";

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

      return data as Post[];
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Naujienos</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {posts?.map((post) => (
            <NewsCard key={post.id} {...post} />
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
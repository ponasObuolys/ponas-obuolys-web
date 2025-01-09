import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NewsCard } from "@/components/NewsCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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

export default function Blog() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      console.log("Fetching all blog posts...");
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
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts:", error);
        throw error;
      }

      return data as Post[];
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12">Naujienos</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {posts?.map((post) => (
          <NewsCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
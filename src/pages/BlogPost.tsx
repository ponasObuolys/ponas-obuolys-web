import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { NotFound } from "@/components/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      console.log("Fetching blog post with slug:", slug);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          author:profiles(
            username,
            avatar_url
          )
        `
        )
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }

      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <NotFound />;

  return (
    <ErrorBoundary>
      <article className="max-w-4xl mx-auto px-4 py-12">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-lg mb-8"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.author && (
          <div className="flex items-center gap-2 mb-8 text-muted-foreground">
            {post.author.avatar_url && (
              <img
                src={post.author.avatar_url}
                alt={post.author.username || "Author"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{post.author.username}</span>
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </div>
      </article>
    </ErrorBoundary>
  );
}
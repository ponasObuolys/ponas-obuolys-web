import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { NotFound } from "@/components/NotFound";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CommentSection } from "@/components/Comments/CommentSection";
import { SocialShare } from "@/components/ui/SocialShare";
import { useAuth } from "@/hooks/useAuth";
import { ReadingProgress } from "@/components/ui/ReadingProgress";

interface CommentResponse {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface FormattedComment {
  id: string;
  content: string;
  date: Date;
  author: string;
  avatarUrl: string | null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  console.log("BlogPost component rendered with slug:", slug);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      console.log("Starting blog post fetch with slug:", slug);
      
      if (!slug) {
        console.error("No slug provided");
        return null;
      }

      try {
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
          if (error.code === 'PGRST116') {
            // No rows returned
            console.log("No post found with slug:", slug);
            return null;
          }
          console.error("Supabase error fetching blog post:", error);
          throw error;
        }

        if (!data) {
          console.log("No post data returned for slug:", slug);
          return null;
        }

        console.log("Successfully fetched blog post:", data);

        // Update document head with OpenGraph meta tags
        const metaTags = {
          title: data.title,
          image: data.featured_image || '/og-image.png',
          description: data.excerpt || data.content?.substring(0, 160) || '',
          url: window.location.href
        };

        document.title = metaTags.title;
        updateMetaTags(metaTags);

        return data;
      } catch (error) {
        console.error("Error in blog post fetch:", error);
        throw error;
      }
    },
    enabled: !!slug,
    retry: false, // Don't retry if post not found
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery<FormattedComment[]>({
    queryKey: ["comments", slug],
    queryFn: async () => {
      if (!slug) return [];

      try {
        const { data: rawData, error } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles(
              username,
              avatar_url
            )
          `)
          .eq("post_slug", slug)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching comments:", error);
          return [];
        }

        // First cast to unknown, then to our expected type
        const typedData = rawData as unknown as CommentResponse[];
        
        return typedData.map(comment => ({
          id: comment.id,
          content: comment.content,
          date: new Date(comment.created_at),
          author: comment.profiles?.username || "Anonimas",
          avatarUrl: comment.profiles?.avatar_url
        }));
      } catch (error) {
        console.error("Error in comments fetch:", error);
        return [];
      }
    },
    enabled: !!slug
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!slug || !user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("comments")
        .insert({
          content,
          post_slug: slug,
          user_id: user.id
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    }
  });

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  const updateMetaTags = (meta: { title: string; image: string; description: string; url: string }) => {
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(isProperty ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', meta.description);

    // Open Graph meta tags
    updateMetaTag('og:title', meta.title, true);
    updateMetaTag('og:description', meta.description, true);
    updateMetaTag('og:image', meta.image, true);
    updateMetaTag('og:url', meta.url, true);
    updateMetaTag('og:type', 'article', true);
    updateMetaTag('og:site_name', 'ponas Obuolys', true);

    // Twitter meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', '@ponasObuolys');
    updateMetaTag('twitter:title', meta.title);
    updateMetaTag('twitter:description', meta.description);
    updateMetaTag('twitter:image', meta.image);

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', meta.url);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <NotFound />;
  if (error) {
    console.error("Error in BlogPost component:", error);
    return <NotFound />;
  }

  return (
    <ErrorBoundary>
      <ReadingProgress />
      <article className="max-w-4xl mx-auto px-4 py-12">
        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-lg mb-8"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 mb-8 text-muted-foreground">
          {post.author?.avatar_url && (
            <img
              src={post.author.avatar_url}
              alt={post.author.username || "Autorius"}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span>{post.author?.username || "ponas Obuolys"}</span>
            <span className="hidden sm:inline">•</span>
            <span>{formatLithuanianDate(post.published_at || post.created_at)}</span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
        </div>

        <div className="border-t pt-8">
          <SocialShare
            url={window.location.href}
            title={post.title}
            description={post.excerpt || post.content?.substring(0, 160) || ""}
            image={post.featured_image || '/og-image.png'}
          />
        </div>

        <div className="border-t mt-8 pt-8">
          <CommentSection
            comments={comments}
            onAddComment={(content) => addCommentMutation.mutate(content)}
            currentUser={user ? {
              name: user.user_metadata?.username || "Vartotojas",
              avatarUrl: user.user_metadata?.avatar_url
            } : undefined}
          />
        </div>
      </article>
    </ErrorBoundary>
  );
}
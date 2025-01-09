import { useQuery } from "@tanstack/react-query";
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

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      console.log("Fetching blog post with slug:", slug);
      
      if (!slug) {
        console.error("No slug provided");
        return null;
      }

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
        .maybeSingle();

      if (error) {
        console.error("Error fetching blog post:", error);
        throw error;
      }

      // Update document head with OpenGraph meta tags
      if (data) {
        const metaTags = {
          title: data.title,
          image: data.featured_image || '/og-image.png',
          description: data.excerpt || data.content?.substring(0, 160) || '',
          url: window.location.href
        };

        document.title = metaTags.title;
        updateMetaTags(metaTags);
      }

      return data;
    },
    enabled: !!slug,
  });

  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!post) return;

    const url = window.location.href;
    const title = post.title;
    const description = post.excerpt || post.content?.substring(0, 160) || '';

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Nuoroda nukopijuota!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Nepavyko nukopijuoti nuorodos");
    }
  };

  const updateMetaTags = (meta: { title: string; image: string; description: string; url: string }) => {
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('og:title', meta.title);
    updateMetaTag('og:image', meta.image);
    updateMetaTag('og:description', meta.description);
    updateMetaTag('og:url', meta.url);
    updateMetaTag('twitter:title', meta.title);
    updateMetaTag('twitter:image', meta.image);
    updateMetaTag('twitter:description', meta.description);
  };

  if (isLoading) return <LoadingSpinner />;
  if (!post || error) return <NotFound />;

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
          <h2 className="text-lg font-semibold mb-4">Dalintis straipsniu:</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('facebook')}
              title="Dalintis Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('twitter')}
              title="Dalintis Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleShare('linkedin')}
              title="Dalintis LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={copyLink}
              title="Kopijuoti nuorodą"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
    </ErrorBoundary>
  );
}
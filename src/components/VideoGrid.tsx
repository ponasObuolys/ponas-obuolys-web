import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { lt } from 'date-fns/locale';
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  published_at: string;
}

const PAGE_SIZE = 12;

const fetchVideos = async ({ pageParam = 0 }) => {
  console.log('Fetching videos from Supabase, page:', pageParam);
  
  const { data, error, count } = await supabase
    .from('youtube_videos')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

  if (error) throw error;

  return {
    data,
    nextPage: data.length === PAGE_SIZE ? pageParam + 1 : null,
    total: count
  };
};

export const VideoGrid = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['youtube-videos'],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Set up realtime subscription for new videos
  useEffect(() => {
    const channel = supabase
      .channel('youtube-videos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'youtube_videos'
        },
        () => {
          // Invalidate and refetch when videos are updated
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-t-lg" />
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Nepavyko įkelti video. Pabandykite dar kartą.</p>
      </div>
    );
  }

  const allVideos = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((video: YouTubeVideo) => (
          <a
            key={video.id}
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105"
          >
            <Card className="overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <CardHeader>
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(video.published_at), { 
                    addSuffix: true,
                    locale: lt 
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
      
      <div 
        ref={loadMoreRef} 
        className="h-10 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="animate-pulse text-gray-500">Užkraunami likę video...</div>
        )}
      </div>
    </div>
  );
};
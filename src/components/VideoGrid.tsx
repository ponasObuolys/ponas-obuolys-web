import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchYouTubeVideos, type YouTubeVideo } from "@/services/youtube";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

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
    queryFn: ({ pageParam }) => fetchYouTubeVideos(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: null,
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
        <p className="text-red-500">Failed to load videos. Please try again later.</p>
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
                  {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
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
          <div className="animate-pulse text-gray-500">Loading more videos...</div>
        )}
      </div>
    </div>
  );
};
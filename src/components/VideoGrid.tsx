import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Play } from "lucide-react";
import { format } from "date-fns";
import { lt } from 'date-fns/locale';
import { Button } from "./ui/button";

interface CachedVideo {
  video_id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  published_at: string;
  views_count?: number;
}

const VIDEOS_PER_PAGE = 12;

export function VideoGrid() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["cached-videos"],
    queryFn: async ({ pageParam = 0 }) => {
      console.log("VideoGrid: Fetching cached videos page:", pageParam);
      const start = pageParam * VIDEOS_PER_PAGE;
      const end = start + VIDEOS_PER_PAGE - 1;

      const { data: videos, error } = await supabase
        .from("cached_youtube_videos")
        .select("*")
        .order("published_at", { ascending: false })
        .range(start, end);

      if (error) {
        console.error("VideoGrid: Error fetching cached videos:", error);
        throw error;
      }

      console.log(`VideoGrid: Found ${videos?.length || 0} videos for page ${pageParam}`);
      return {
        videos,
        nextPage: videos.length === VIDEOS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  if (isLoading) {
    console.log("VideoGrid: Loading state");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/50 dark:bg-gray-800/50">
            <AspectRatio ratio={16/9}>
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
            </AspectRatio>
            <CardContent className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages.map((page) =>
          page.videos.map((video: CachedVideo) => (
            <a
              key={video.video_id}
              href={`https://youtube.com/watch?v=${video.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/50 dark:bg-gray-800/50">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-t-lg">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="mt-auto space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      {format(new Date(video.published_at), "yyyy 'm.' MMMM dd 'd.'", { 
                        locale: lt 
                      })}
                    </p>
                    {video.views_count !== undefined && (
                      <p>{video.views_count.toLocaleString('lt-LT')} peržiūrų</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))
        )}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Kraunama..." : "Rodyti daugiau"}
          </Button>
        </div>
      )}
    </div>
  );
}
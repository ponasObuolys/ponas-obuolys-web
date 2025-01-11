import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { lt } from 'date-fns/locale';

interface CachedVideo {
  video_id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  published_at: string;
}

export function LatestVideos() {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["latest-cached-videos"],
    queryFn: async () => {
      console.log("Fetching latest cached videos");
      const { data, error } = await supabase
        .from("cached_youtube_videos")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching cached videos:", error);
        throw error;
      }

      return data as CachedVideo[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Naujausi vaizdo įrašai</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse min-h-[360px] bg-white/50 dark:bg-gray-800/50">
                <div className="h-[200px] bg-gray-200 dark:bg-gray-700" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Naujausi vaizdo įrašai</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {videos?.map((video) => (
            <a
              key={video.video_id}
              href={`https://youtube.com/watch?v=${video.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/50 dark:bg-gray-800/50">
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(video.published_at), { 
                      addSuffix: true,
                      locale: lt 
                    })}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/videos">
              Visi vaizdo įrašai
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
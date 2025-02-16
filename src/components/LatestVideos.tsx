import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchYouTubeVideos } from "@/services/youtube";
import { formatDistanceToNow } from "date-fns";
import { lt } from 'date-fns/locale';
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export function LatestVideos() {
  const { data, isLoading } = useQuery({
    queryKey: ['youtube-videos-home'],
    queryFn: () => fetchYouTubeVideos(),
    select: (data) => data.data.slice(0, 3)
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Naujausi video</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse min-h-[400px]">
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Naujausi video</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {data?.map((video) => (
            <a
              key={video.id}
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <Card className="h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/50 dark:bg-gray-800/50 rounded-lg transform-gpu will-change-transform">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <OptimizedImage
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 flex-grow">
                  <CardTitle className="text-xl mb-3 line-clamp-2">
                    {video.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                    <span>
                      {formatDistanceToNow(new Date(video.publishedAt), { 
                        addSuffix: true,
                        locale: lt 
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/video">
            <Button size="lg" variant="outline">
              Žiūrėti visus video
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 
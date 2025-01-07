import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fetchYouTubeVideos } from "@/services/youtube";
import { formatDistanceToNow } from "date-fns";

export const FeaturedVideos = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['featured-videos'],
    queryFn: () => fetchYouTubeVideos(null),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
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
    console.error('Error fetching featured videos:', error);
    return null;
  }

  const featuredVideos = data?.data.slice(0, 3) ?? [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredVideos.map((video) => (
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
      
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/videos')}
          className="group hover:scale-105 transition-transform"
          size="lg"
        >
          Žiūrėti daugiau
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
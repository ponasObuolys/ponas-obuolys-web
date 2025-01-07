import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchYouTubeVideos, type YouTubeVideo } from "@/services/youtube";
import { formatDistanceToNow } from "date-fns";

export const VideoGrid = () => {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: () => fetchYouTubeVideos(),
  });

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {videos?.map((video: YouTubeVideo) => (
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
  );
};
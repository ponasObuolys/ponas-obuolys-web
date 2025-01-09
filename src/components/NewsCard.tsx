import { format } from "date-fns";
import { lt } from 'date-fns/locale';
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface NewsCardProps {
  id: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  slug: string;
  featured_image?: string | null;
  published_at: string;
  author: {
    username: string | null;
  } | null;
}

export function NewsCard({ 
  title, 
  content,
  excerpt, 
  slug, 
  featured_image, 
  published_at, 
  author 
}: NewsCardProps) {
  const formatLithuanianDate = (date: string) => {
    return format(new Date(date), "yyyy 'm.' MMMM d 'd.'", { locale: lt });
  };

  const getPreviewText = () => {
    if (excerpt) return excerpt;
    if (content) return content.substring(0, 200);
    return null;
  };

  const previewText = getPreviewText();

  return (
    <Link to={`/naujienos/${slug}`}>
      <Card className="min-h-[500px] flex flex-col hover:shadow-lg transition-shadow">
        {featured_image && (
          <div className="aspect-video">
            <img
              src={featured_image}
              alt={title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardContent className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-2 mb-4">
            <span>{formatLithuanianDate(published_at)}</span>
            <span>•</span>
            <span>{author?.username || "ponas Obuolys"}</span>
          </div>
          {previewText && (
            <p className="text-gray-600 line-clamp-3 mb-6">
              {previewText}
            </p>
          )}
          <Button className="mt-auto w-full">Skaityti naujieną</Button>
        </CardContent>
      </Card>
    </Link>
  );
}
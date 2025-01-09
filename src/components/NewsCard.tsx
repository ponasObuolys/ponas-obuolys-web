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
    if (content) {
      const cleaned = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
      return cleaned.length > 200 
        ? `${cleaned.substring(0, 200)}...` 
        : cleaned;
    }
    return null;
  };

  return (
    <Link to={`/naujienos/${slug}`}>
      <Card className="h-[600px] flex flex-col hover:shadow-lg transition-shadow">
        {featured_image && (
          <div className="h-[300px]">
            <img
              src={featured_image}
              alt={title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardContent className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-3 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{formatLithuanianDate(published_at)}</span>
            <span className="mx-2">•</span>
            <span>{author?.username || "ponas Obuolys"}</span>
          </div>
          <div className="flex-grow">
            {getPreviewText() && (
              <p className="text-gray-600 line-clamp-3">
                {getPreviewText()}
              </p>
            )}
          </div>
          <Button variant="default" className="w-full mt-4">
            Skaityti naujieną
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
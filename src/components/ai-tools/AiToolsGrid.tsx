import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { AiTool } from "@/types/ai-tools";

interface AiToolsGridProps {
  tools: (AiTool & {
    category: { id: string; name: string } | null;
  })[];
}

export const AiToolsGrid = ({ tools }: AiToolsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Card key={tool.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{tool.name}</CardTitle>
              {tool.is_recommended && (
                <Badge variant="secondary">Rekomenduojama</Badge>
              )}
            </div>
            {tool.category && (
              <Badge variant="outline">{tool.category.name}</Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video relative rounded-md overflow-hidden">
              <img
                src={tool.thumbnail}
                alt={tool.name}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {tool.description}
            </p>
            {tool.affiliate_link && (
              <a
                href={tool.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Sužinoti daugiau
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
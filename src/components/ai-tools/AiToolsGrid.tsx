import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil } from "lucide-react";
import type { AiTool } from "@/types/ai-tools";

interface AiToolsGridProps {
  tools: (AiTool & {
    category: { id: string; name: string } | null;
  })[];
  onEdit?: (tool: AiTool) => void;
}

export const AiToolsGrid = ({ tools, onEdit }: AiToolsGridProps) => {
  const getPricingBadgeStyle = (pricing: AiTool['pricing_model']) => {
    switch (pricing) {
      case 'free':
        return 'text-green-500 bg-green-50 border-green-100';
      case 'freemium':
        return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'paid':
        return 'text-red-500 bg-red-50 border-red-100';
    }
  };

  const getPricingLabel = (pricing: AiTool['pricing_model']) => {
    switch (pricing) {
      case 'free':
        return 'Nemokama';
      case 'freemium':
        return 'Freemium';
      case 'paid':
        return 'Mokama';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Card key={tool.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-1">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{tool.name}</CardTitle>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(tool)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.category && (
                <Badge variant="outline">{tool.category.name}</Badge>
              )}
              <Badge className={getPricingBadgeStyle(tool.pricing_model)}>
                {getPricingLabel(tool.pricing_model)}
              </Badge>
              {tool.special_offer && (
                <Badge className="text-purple-500 bg-purple-50 border-purple-100">
                  Specialus pasiūlymas
                </Badge>
              )}
              {tool.is_recommended && (
                <Badge variant="secondary">Rekomenduojama</Badge>
              )}
            </div>
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
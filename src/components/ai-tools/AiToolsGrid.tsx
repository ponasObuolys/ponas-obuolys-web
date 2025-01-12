import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
        <a
          key={tool.id}
          href={tool.affiliate_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <Card className="h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="space-y-1">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{tool.name}</CardTitle>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(tool);
                    }}
                    className="h-8 w-8"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {tool.category && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gray-50/50 dark:bg-gray-800/50 rounded-full px-2.5 py-0.5"
                  >
                    {tool.category.name}
                  </Badge>
                )}
                <Badge 
                  className={`text-xs rounded-full px-2.5 py-0.5 ${getPricingBadgeStyle(tool.pricing_model)}`}
                >
                  {getPricingLabel(tool.pricing_model)}
                </Badge>
                {tool.special_offer && (
                  <Badge 
                    className="text-xs text-purple-500 bg-purple-50 border-purple-100 rounded-full px-2.5 py-0.5"
                  >
                    Specialus pasiūlymas
                  </Badge>
                )}
                {tool.is_recommended && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs rounded-full px-2.5 py-0.5"
                  >
                    Rekomenduojama
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <div className="aspect-video relative rounded-md overflow-hidden mb-4">
                <img
                  src={tool.thumbnail}
                  alt={tool.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {tool.description}
              </p>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronRight } from "lucide-react";
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
        <Card 
          key={tool.id} 
          className="group hover:shadow-lg transition-all duration-300 relative flex flex-col"
        >
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
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tool.category && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-50 dark:bg-gray-800"
                >
                  {tool.category.name}
                </Badge>
              )}
              <Badge className={`text-xs ${getPricingBadgeStyle(tool.pricing_model)}`}>
                {getPricingLabel(tool.pricing_model)}
              </Badge>
              {tool.special_offer && (
                <Badge className="text-xs text-purple-500 bg-purple-50 border-purple-100">
                  Specialus pasiūlymas
                </Badge>
              )}
              {tool.is_recommended && (
                <Badge variant="secondary" className="text-xs">
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
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {tool.description}
            </p>
            {tool.affiliate_link && (
              <a
                href={tool.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Sužinoti daugiau
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
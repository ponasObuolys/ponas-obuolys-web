import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Tool {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  pricing_model: 'free' | 'freemium' | 'paid';
  special_offer: string | null;
  slug: string;
  affiliate_link?: string | null;
}

export function LatestTools() {
  const { data: tools, isLoading } = useQuery({
    queryKey: ["latest-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tools")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching latest tools:", error);
        throw error;
      }

      return data as Tool[];
    },
  });

  const getPricingBadgeStyle = (pricing: Tool['pricing_model']) => {
    switch (pricing) {
      case 'free':
        return 'text-green-500 bg-green-50 border-green-100';
      case 'freemium':
        return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'paid':
        return 'text-red-500 bg-red-50 border-red-100';
    }
  };

  const getPricingLabel = (pricing: Tool['pricing_model']) => {
    switch (pricing) {
      case 'free':
        return 'Nemokama';
      case 'freemium':
        return 'Freemium';
      case 'paid':
        return 'Mokama';
    }
  };

  const handleToolClick = (tool: Tool) => {
    if (tool.affiliate_link) {
      window.open(tool.affiliate_link, '_blank', 'noopener noreferrer');
    }
  };

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Naujausi įrankiai</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((n) => (
              <Card key={n} className="animate-pulse min-h-[480px] bg-white/50 dark:bg-gray-800/50">
                <div className="h-[200px] bg-gray-200 dark:bg-gray-700" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  </div>
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
        <h2 className="text-3xl font-bold mb-8">Naujausi įrankiai</h2>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tools?.map((tool) => (
            <Link 
              key={tool.id} 
              to={`/irankiai/${tool.slug}`}
              target={tool.affiliate_link ? "_blank" : undefined}
              rel={tool.affiliate_link ? "noopener noreferrer" : undefined}
              onClick={(e) => {
                if (tool.affiliate_link) {
                  e.preventDefault();
                  handleToolClick(tool);
                }
              }}
              className="block group"
            >
              <Card className="h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-lg bg-white/50 dark:bg-gray-800/50 cursor-pointer">
                <div className="relative h-[200px] w-full overflow-hidden">
                  <img
                    src={tool.thumbnail}
                    alt={tool.name}
                    className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-6">
                    {tool.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Badge className={getPricingBadgeStyle(tool.pricing_model)}>
                      {getPricingLabel(tool.pricing_model)}
                    </Badge>
                    {tool.special_offer && (
                      <Badge className="text-purple-500 bg-purple-50 border-purple-100">
                        Specialus pasiūlymas
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/irankiai">
              Žiūrėti visus įrankius
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
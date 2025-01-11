import { useState } from "react";
import { Hero } from "@/components/Hero";
import { LatestNews } from "@/components/LatestNews";
import { AiToolsGrid } from "@/components/ai-tools/AiToolsGrid";
import { AiToolsFilters } from "@/components/ai-tools/AiToolsFilters";
import { useAiTools } from "@/hooks/useAiTools";
import type { AiToolsFilters as AiToolsFiltersType } from "@/types/ai-tools";

export default function Index() {
  const [filters, setFilters] = useState<AiToolsFiltersType>({
    search: "",
    pricing: "all",
    categoryId: null,
  });

  const { data: tools, isLoading } = useAiTools(filters);

  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12 space-y-12">
        <LatestNews />
        
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">AI Įrankiai</h2>
          </div>
          
          <AiToolsFilters
            filters={filters}
            onFiltersChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : (
            <AiToolsGrid tools={tools || []} />
          )}
        </section>
      </div>
    </div>
  );
}
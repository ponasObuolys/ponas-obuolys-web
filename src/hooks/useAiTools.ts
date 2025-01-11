import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AiTool, AiToolsFilters } from "@/types/ai-tools";

export const useAiTools = (filters: AiToolsFilters) => {
  return useQuery({
    queryKey: ["ai-tools", filters],
    queryFn: async () => {
      console.log("Fetching AI tools with filters:", filters);
      let query = supabase
        .from("ai_tools")
        .select(`
          *,
          category:categories(id, name)
        `);

      if (filters.search) {
        query = query.textSearch("search_vector", filters.search);
      }

      if (filters.pricing !== "all") {
        query = query.eq("pricing_model", filters.pricing);
      }

      if (filters.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching AI tools:", error);
        throw error;
      }

      return data as (AiTool & {
        category: { id: string; name: string } | null;
      })[];
    },
  });
};
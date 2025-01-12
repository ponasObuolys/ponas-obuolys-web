import { Database } from "@/integrations/supabase/types";

export type AiTool = Database["public"]["Tables"]["ai_tools"]["Row"];
export type PricingModel = Database["public"]["Enums"]["pricing_model"];

export interface AiToolsFilters {
  search: string;
  pricing: PricingModel | "all";
  categoryId: string | null;
  category: string;
}
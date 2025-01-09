import { Database } from "@/integrations/supabase/types";

export type Course = Database["public"]["Tables"]["courses"]["Row"] & {
  profiles?: {
    username: string | null;
  } | null;
};

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  currency: "USD" | "EUR" | "LTL";
  thumbnail: string;
  categories: string[];
  tags: string[];
}

export interface CourseFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
}
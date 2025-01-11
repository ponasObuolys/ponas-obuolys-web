import { Database } from "@/integrations/supabase/types";

export type Course = Database["public"]["Tables"]["courses"]["Row"] & {
  profiles?: {
    username: string | null;
  } | null;
};

export type CourseContent = Database["public"]["Tables"]["course_content"]["Row"];

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  currency: "USD" | "EUR" | "LTL";
  thumbnail: string;
  categories: string[];
  tags: string[];
  start_date: Date;
  end_date: Date;
  status: 'upcoming' | 'active' | 'completed' | 'draft';
}

export interface CourseFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  status?: 'upcoming' | 'active' | 'completed' | 'draft';
}
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AiToolsFilters as AiToolsFiltersType } from "@/types/ai-tools";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AiToolsFiltersProps {
  filters: AiToolsFiltersType;
  onFiltersChange: (filters: Partial<AiToolsFiltersType>) => void;
}

export const AiToolsFilters = ({
  filters,
  onFiltersChange,
}: AiToolsFiltersProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data;
    },
  });

  // Debounce the search input with 300ms delay
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFiltersChange({ search: value });
    }, 300),
    [onFiltersChange]
  );

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ieškoti įrankių..."
          defaultValue={filters.search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select
        value={filters.pricing}
        onValueChange={(value) =>
          onFiltersChange({ pricing: value as AiToolsFiltersType["pricing"] })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kainodara" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Visi</SelectItem>
          <SelectItem value="free">Nemokami</SelectItem>
          <SelectItem value="freemium">Freemium</SelectItem>
          <SelectItem value="paid">Mokami</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.categoryId || "all"}
        onValueChange={(value) =>
          onFiltersChange({ categoryId: value === "all" ? null : value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Kategorija" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Visos kategorijos</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
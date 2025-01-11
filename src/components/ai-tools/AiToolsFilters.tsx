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

interface AiToolsFiltersProps {
  filters: AiToolsFiltersType;
  onFiltersChange: (filters: Partial<AiToolsFiltersType>) => void;
}

export const AiToolsFilters = ({
  filters,
  onFiltersChange,
}: AiToolsFiltersProps) => {
  // Debounce the search input with 300ms delay
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onFiltersChange({ search: value });
    }, 300),
    [onFiltersChange]
  );

  return (
    <div className="flex items-center gap-4">
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
    </div>
  );
};
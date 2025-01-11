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

interface AiToolsFiltersProps {
  filters: AiToolsFiltersType;
  onFiltersChange: (filters: Partial<AiToolsFiltersType>) => void;
}

export const AiToolsFilters = ({
  filters,
  onFiltersChange,
}: AiToolsFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Ieškoti įrankių..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
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
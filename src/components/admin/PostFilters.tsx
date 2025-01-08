import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostFilters } from "./types";

interface PostFiltersProps {
  filters: PostFilters;
  onFiltersChange: (filters: Partial<PostFilters>) => void;
}

export const PostFilters = ({ filters, onFiltersChange }: PostFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search posts..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="pl-8"
        />
      </div>
      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange({ status: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
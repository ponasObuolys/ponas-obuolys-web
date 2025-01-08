import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lt } from "@/i18n/lt";
import type { PostFiltersProps } from "./types";

export const PostFilters = ({ filters, onFiltersChange }: PostFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={lt.admin.search}
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
          <SelectValue placeholder={lt.admin.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{lt.admin.allStatus}</SelectItem>
          <SelectItem value="published">{lt.admin.publishedStatus}</SelectItem>
          <SelectItem value="draft">{lt.admin.draftStatus}</SelectItem>
          <SelectItem value="scheduled">{lt.admin.scheduledStatus}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
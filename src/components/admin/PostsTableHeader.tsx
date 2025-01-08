import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PostsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  selectedPosts: string[];
  onBulkAction: (action: string) => void;
}

export const PostsTableHeader = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedPosts,
  onBulkAction,
}: PostsTableHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
        {selectedPosts.length > 0 && (
          <Select
            onValueChange={onBulkAction}
            defaultValue=""
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Bulk actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publish">Publish Selected</SelectItem>
              <SelectItem value="draft">Move to Draft</SelectItem>
              <SelectItem value="delete">Delete Selected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
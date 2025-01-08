import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BulkActionProps } from "./types";

export const PostBulkActions = ({ selectedPosts, onBulkAction }: BulkActionProps) => {
  if (selectedPosts.length === 0) return null;

  return (
    <Select onValueChange={onBulkAction} defaultValue="">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Bulk actions" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="publish">Publish Selected</SelectItem>
        <SelectItem value="draft">Move to Draft</SelectItem>
        <SelectItem value="delete">Delete Selected</SelectItem>
      </SelectContent>
    </Select>
  );
};
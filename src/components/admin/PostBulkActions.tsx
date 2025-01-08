import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { lt } from "@/i18n/lt";
import { BulkActionProps } from "./types";

export const PostBulkActions = ({ selectedPosts, onBulkAction }: BulkActionProps) => {
  if (selectedPosts.length === 0) return null;

  return (
    <Select onValueChange={onBulkAction} defaultValue="">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={lt.admin.bulkActions} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="publish">{lt.admin.publishSelected}</SelectItem>
        <SelectItem value="draft">{lt.admin.moveToTrash}</SelectItem>
        <SelectItem value="delete">{lt.admin.deleteSelected}</SelectItem>
      </SelectContent>
    </Select>
  );
};
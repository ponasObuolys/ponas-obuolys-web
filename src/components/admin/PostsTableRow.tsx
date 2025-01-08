import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Eye, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostTableProps } from "./types";

export const PostsTableRow = ({
  post,
  selected,
  onSelect,
  onStatusChange,
  onDelete,
  onNavigate,
}: PostTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => onSelect(post.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>{post.title}</TableCell>
      <TableCell>{post.author?.username || "Unknown"}</TableCell>
      <TableCell>
        <Select value={post.status} onValueChange={(value) => onStatusChange(post.id, value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>{post.views_count}</TableCell>
      <TableCell>{format(new Date(post.created_at), "MMM d, yyyy")}</TableCell>
      <TableCell>
        {post.published_at
          ? format(new Date(post.published_at), "MMM d, yyyy")
          : "-"}
      </TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(`/admin/posts/${post.id}`)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate(`/blog/${post.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(post.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
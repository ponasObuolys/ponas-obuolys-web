import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Eye, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Post } from "./types";

interface PostsTableRowProps {
  post: Post;
  onDelete: (id: string) => void;
  onNavigate: (path: string) => void;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
}

export const PostsTableRow = ({
  post,
  onDelete,
  onNavigate,
  selected,
  onSelect,
}: PostsTableRowProps) => {
  const getStatusColor = (status: Post["status"]) => {
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
        <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
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
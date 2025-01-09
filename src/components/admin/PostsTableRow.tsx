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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { lt } from "@/i18n/lt";
import type { PostTableProps, PostStatus } from "./types";

export const PostsTableRow = ({
  post,
  selected,
  onSelect,
  onStatusChange,
  onDelete,
  onNavigate,
}: PostTableProps) => {
  console.log("Rendering PostsTableRow for post:", post.id);

  const getStatusColor = (status: PostStatus) => {
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

  const getStatusText = (status: PostStatus) => {
    switch (status) {
      case "published":
        return lt.admin.publishedStatus;
      case "draft":
        return lt.admin.draftStatus;
      case "scheduled":
        return lt.admin.scheduledStatus;
      default:
        return status;
    }
  };

  const handleStatusChange = (newStatus: PostStatus) => {
    onStatusChange(post.id, newStatus);
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
        <Select value={post.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue>
              <Badge variant={getStatusColor(post.status)}>
                {getStatusText(post.status)}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published">{lt.admin.publishedStatus}</SelectItem>
            <SelectItem value="draft">{lt.admin.draftStatus}</SelectItem>
            <SelectItem value="scheduled">{lt.admin.scheduledStatus}</SelectItem>
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
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate(`/editor/${post.id}`)}
            className="hover:bg-gray-100"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onNavigate(`/naujienos/${post.slug}`)}
            className="hover:bg-gray-100"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-red-50 hover:text-red-600"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ar tikrai norite ištrinti?</AlertDialogTitle>
                <AlertDialogDescription>
                  Šio veiksmo negalima atšaukti. Naujiena bus visam laikui ištrinta iš sistemos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Atšaukti</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(post.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Ištrinti
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
};
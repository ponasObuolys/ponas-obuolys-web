import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { lt } from "date-fns/locale";
import { MessageCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const [content, setContent] = useState("");
  const session = useSession();
  const { role } = useUserRole();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      console.log("Fetching comments for post:", postId);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          user_id,
          author:profiles(username, avatar_url)
        `)
        .eq("news_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }

      return data as Comment[];
    },
  });

  const createComment = useMutation({
    mutationFn: async (content: string) => {
      if (!session?.user) throw new Error("Must be logged in to comment");

      const { error } = await supabase.from("comments").insert({
        news_id: postId,
        user_id: session.user.id,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Komentaras pridėtas");
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast.error("Nepavyko pridėti komentaro");
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("Komentaras ištrintas");
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
      toast.error("Nepavyko ištrinti komentaro");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(content);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "yyyy-MM-dd HH:mm", { locale: lt });
  };

  if (isLoading) {
    return <div className="animate-pulse">Kraunami komentarai...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <MessageCircle className="h-6 w-6" />
        <h2>Komentarai ({comments.length})</h2>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Parašykite komentarą..."
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={createComment.isPending}>
            {createComment.isPending ? "Siunčiama..." : "Komentuoti"}
          </Button>
        </form>
      ) : (
        <p className="text-muted-foreground">
          Prisijunkite, kad galėtumėte komentuoti
        </p>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {comment.author?.avatar_url && (
                  <img
                    src={comment.author.avatar_url}
                    alt={comment.author.username || ""}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium">
                  {comment.author?.username || "Anonimas"}
                </span>
                <span className="text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              {(session?.user?.id === comment.user_id || role === "admin") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteComment.mutate(comment.id)}
                  disabled={deleteComment.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
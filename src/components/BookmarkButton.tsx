import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface BookmarkButtonProps {
  postId: string;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: bookmark } = useQuery({
    queryKey: ["bookmark", postId],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  const toggleBookmark = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast({
          title: "Prisijunkite",
          description: "Norėdami išsaugoti straipsnį, turite būti prisijungę",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        if (bookmark) {
          const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", bookmark.id);

          if (error) {
            console.error("Error deleting bookmark:", error);
            if (error.code === "42501") {
              throw new Error("Neturite teisių ištrinti šį įrašą");
            }
            throw error;
          }
        } else {
          const { error } = await supabase
            .from("bookmarks")
            .insert([
              {
                post_id: postId,
                user_id: user.id,
              },
            ]);

          if (error) {
            console.error("Error creating bookmark:", error);
            if (error.code === "23505") {
              throw new Error("Straipsnis jau išsaugotas");
            } else if (error.code === "42501") {
              throw new Error("Neturite teisių išsaugoti straipsnį");
            }
            throw error;
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", postId] });
      toast({
        title: bookmark ? "Ištrinta iš išsaugotų" : "Išsaugota",
        description: bookmark
          ? "Straipsnis pašalintas iš išsaugotų"
          : "Straipsnis pridėtas prie išsaugotų",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Klaida",
        description: error.message || "Nepavyko atlikti veiksmo. Bandykite dar kartą vėliau.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleBookmark.mutate()}
      disabled={isLoading}
      className={bookmark ? "text-primary" : "text-muted-foreground"}
      title={bookmark ? "Pašalinti iš išsaugotų" : "Išsaugoti straipsnį"}
    >
      <Bookmark className="h-5 w-5" />
    </Button>
  );
} 
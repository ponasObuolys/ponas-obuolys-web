import { Button } from "@/components/ui/button";

interface PostFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const PostFormActions = ({ isSubmitting, onCancel }: PostFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Atšaukti
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saugoma..." : "Išsaugoti"}
      </Button>
    </div>
  );
};
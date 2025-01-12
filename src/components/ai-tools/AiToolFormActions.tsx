import { Button } from "@/components/ui/button";

interface AiToolFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onDelete?: () => void;
}

export function AiToolFormActions({ isSubmitting, isEditing, onDelete }: AiToolFormActionsProps) {
  return (
    <div className="flex justify-between">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saugoma..." : isEditing ? "Atnaujinti" : "Pridėti įrankį"}
      </Button>
      {isEditing && onDelete && (
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={isSubmitting}
        >
          Ištrinti
        </Button>
      )}
    </div>
  );
}
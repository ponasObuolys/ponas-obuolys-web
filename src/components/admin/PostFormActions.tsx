import { Button } from "@/components/ui/button";

interface PostFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onPreview: () => Promise<void>;
  isPreviewLoading: boolean;
}

export const PostFormActions = ({ 
  isSubmitting, 
  onCancel, 
  onPreview,
  isPreviewLoading 
}: PostFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        disabled={isSubmitting || isPreviewLoading}
      >
        {isPreviewLoading ? "Peržiūrima..." : "Peržiūrėti"}
      </Button>
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
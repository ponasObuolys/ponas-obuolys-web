import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import MediaUploader from "@/components/editor/MediaUploader";
import { UseFormReturn } from "react-hook-form";

interface AiToolImageUploadProps {
  form: UseFormReturn<any>;
  onImageUpload: (file: File) => Promise<void>;
  isSubmitting: boolean;
}

export function AiToolImageUpload({ form, onImageUpload, isSubmitting }: AiToolImageUploadProps) {
  return (
    <FormField
      control={form.control}
      name="thumbnail"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nuotrauka</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <MediaUploader
                onUpload={onImageUpload}
                disabled={isSubmitting}
              />
              {field.value && (
                <img
                  src={field.value}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
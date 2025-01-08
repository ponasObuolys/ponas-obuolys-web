import React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface MediaUploaderProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

const MediaUploader = ({ onUpload, disabled }: MediaUploaderProps) => {
  const [uploading, setUploading] = React.useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-media")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("blog-media")
        .getPublicUrl(fileName);

      onUpload(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error uploading image",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        disabled={disabled || uploading}
        onClick={() => document.getElementById("imageInput")?.click()}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="h-4 w-4 mr-2" />
        )}
        Upload Image
      </Button>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={uploadImage}
        onClick={(e) => e.stopPropagation()}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default MediaUploader;
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MediaUploaderProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

const MediaUploader = ({ onUpload, disabled }: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      onUpload(file);
      
      toast.success("Image selected successfully");
    } catch (error) {
      console.error("Error selecting image:", error);
      toast.error("Error selecting image");
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
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default MediaUploader;
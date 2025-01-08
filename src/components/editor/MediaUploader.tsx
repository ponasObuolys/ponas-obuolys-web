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
    event.preventDefault();
    event.stopPropagation();
    
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      await onUpload(file);
      
      // Reset the input value to allow selecting the same file again
      event.target.value = '';
      
      toast.success("Image selected successfully");
    } catch (error) {
      console.error("Error selecting image:", error);
      toast.error("Error selecting image");
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("imageInput")?.click();
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={disabled || uploading}
        onClick={handleButtonClick}
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
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default MediaUploader;
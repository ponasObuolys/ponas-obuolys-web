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
        throw new Error("Turite pasirinkti paveikslėlį.");
      }

      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Galima įkelti tik paveikslėlius.");
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Paveikslėlis negali būti didesnis nei 5MB.");
      }

      await onUpload(file);
      
      // Reset the input value to allow selecting the same file again
      event.target.value = '';
      
      toast.success("Paveikslėlis pasirinktas");
    } catch (error) {
      console.error("Error selecting image:", error);
      toast.error(error.message || "Nepavyko pasirinkti paveikslėlio");
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
        Įkelti paveikslėlį
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
import React from 'react';
import { Button } from "./button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = "",
  image = ""
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,resizable=yes`;
    
    window.open(shareLinks[platform], '_blank', windowFeatures);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Nuoroda nukopijuota!");
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Nuoroda nukopijuota!");
      } catch (err) {
        toast.error("Nepavyko nukopijuoti nuorodos");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">Dalintis:</span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        title="Dalintis Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('twitter')}
        title="Dalintis Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('linkedin')}
        title="Dalintis LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={copyToClipboard}
        title="Kopijuoti nuorodą"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}; 
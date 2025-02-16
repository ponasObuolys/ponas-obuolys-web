import React from 'react';
import { Button } from "./button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = ""
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Nuoroda nukopijuota!");
    } catch (err) {
      toast.error("Nepavyko nukopijuoti nuorodos");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm text-gray-500">Dalintis:</span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        title="Dalintis Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        title="Dalintis Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
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
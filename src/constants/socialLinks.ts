import { Coffee, Facebook, Instagram, MessageCircle, MessageSquare, Youtube } from "lucide-react";

export interface SocialLink {
  name: string;
  url: string;
  icon: any;
  color: string;
  hoverColor?: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: "YouTube",
    url: "https://youtube.com/@ponasObuolys?sub_confirmation=1",
    icon: Youtube,
    color: "bg-[#FF0000]",
    hoverColor: "hover:bg-[#FF0000]/90"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/ponasObuolys.youtube",
    icon: Facebook,
    color: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#1877F2]/90"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/ponasobuolys/",
    icon: Instagram,
    color: "bg-[#E4405F]",
    hoverColor: "hover:bg-[#E4405F]/90"
  },
  {
    name: "Messenger",
    url: "https://m.me/101691029459035",
    icon: MessageCircle,
    color: "bg-[#00B2FF]",
    hoverColor: "hover:bg-[#00B2FF]/90"
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/37067168860",
    icon: MessageSquare,
    color: "bg-[#25D366]",
    hoverColor: "hover:bg-[#25D366]/90"
  }
];

export const supportLinks: SocialLink[] = [
  {
    name: "YouTube Members",
    url: "https://www.youtube.com/channel/UCpybqFxdm6CXhctM2n6Gl_Q/join",
    icon: Youtube,
    color: "bg-[#FF0000]",
    hoverColor: "hover:bg-[#FF0000]/90"
  },
  {
    name: "Patreon",
    url: "https://patreon.com/ponasObuolys",
    icon: MessageSquare,
    color: "bg-[#FF424D]",
    hoverColor: "hover:bg-[#FF424D]/90"
  },
  {
    name: "Buy Me a Coffee",
    url: "https://buymeacoffee.com/ponasobuolys",
    icon: Coffee,
    color: "bg-[#FFDD00]",
    hoverColor: "hover:bg-[#FFDD00]/90"
  }
];
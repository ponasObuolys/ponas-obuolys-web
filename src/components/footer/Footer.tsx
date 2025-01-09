import { Youtube, Coffee, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";

interface SupportLink {
  platform: string;
  url: string;
  icon: any;
  color: string;
}

const supportLinks: SupportLink[] = [
  {
    platform: "YouTube Members",
    url: "https://www.youtube.com/channel/UCpybqFxdm6CXhctM2n6Gl_Q/join",
    icon: Youtube,
    color: "bg-[#FF0000] hover:bg-[#FF0000]/90",
  },
  {
    platform: "Patreon",
    url: "https://patreon.com/ponasObuolys",
    icon: MessageSquare,
    color: "bg-[#FF424D] hover:bg-[#FF424D]/90",
  },
  {
    platform: "Buy Me a Coffee",
    url: "https://buymeacoffee.com/ponasobuolys",
    icon: Coffee,
    color: "bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black",
  },
];

const SocialLinks = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Socialiniai tinklai</h3>
    <div className="flex flex-wrap gap-4">
      {supportLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Prisijunkite prie mūsų ${link.platform}`}
        >
          <Button
            variant="default"
            size="icon"
            className={`${link.color} text-white`}
          >
            <link.icon className="h-5 w-5" />
          </Button>
        </a>
      ))}
    </div>
  </div>
);

const SupportSection = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Paremkite</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Jūsų parama padeda kurti kokybišką turinį ir tobulėti. Ačiū, kad esate kartu!
    </p>
    <div className="flex flex-wrap gap-4">
      {supportLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <link.icon className="h-4 w-4" />
          <span>{link.platform}</span>
        </a>
      ))}
    </div>
  </div>
);

const AdminSection = () => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Administravimas</h3>
      <div className="space-y-2">
        <Link
          to="/admin"
          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Valdymo skydas
        </Link>
        <Link
          to="/editor"
          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Naujas įrašas
        </Link>
        <Link
          to="/settings"
          className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          Nustatymai
        </Link>
      </div>
    </div>
  );
};

const Copyright = () => (
  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
      © {new Date().getFullYear()} ponas Obuolys. Visos teisės saugomos.
    </p>
  </div>
);

export const Footer = () => {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <SocialLinks />
          <SupportSection />
          <AdminSection />
        </div>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
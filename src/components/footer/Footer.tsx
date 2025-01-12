import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { socialLinks, supportLinks } from "@/constants/socialLinks";

const SocialLinks = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Socialiniai tinklai</h3>
    <div className="flex flex-wrap gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Prisijunkite prie mūsų ${link.name}`}
        >
          <Button
            variant="default"
            size="icon"
            className={`${link.color} ${link.hoverColor} text-white`}
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
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <link.icon className="h-4 w-4" />
          <span>{link.name}</span>
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
    <div className="flex flex-col items-center space-y-2">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} ponas Obuolys. Visos teisės saugomos.
      </p>
      <a
        href="https://lovable.dev/#via=ponasObuolys"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors animate-fadeIn"
      >
        Sukurta su Lovable.DEV
      </a>
    </div>
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
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "./ui/use-toast";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";
import { Logo } from "./navigation/Logo";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { theme, setTheme } = useTheme();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko atsijungti. Bandykite dar kartą.",
      });
    } else {
      navigate("/");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { name: "Pradžia", path: "/" },
    { name: "YouTube", path: "/videos" },
    { name: "Naujienos", path: "/naujienos" },
    { name: "Įrankiai", path: "/irankiai" },
    { name: "Kontaktai", path: "/kontaktai" },
    { name: "Apie", path: "/apie" },
    ...(role === "admin" ? [{ name: "Admin", path: "/admin" }] : []),
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-8",
        scrolled && "backdrop-blur-md shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center space-x-8">
          <div className="flex items-center space-x-4">
            <Logo />
            <span className="text-white font-medium">ponas Obuolys</span>
          </div>
          
          <DesktopNav
            navLinks={navLinks}
            session={!!session}
            theme={theme}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            navigate={navigate}
          />

          <MobileNav
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>
    </nav>
  );
};

export { Navigation };
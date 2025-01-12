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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Logo />
          
          <DesktopNav
            navLinks={navLinks}
            session={!!session}
            theme={theme}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            navigate={navigate}
          />

          <MobileNav
            navLinks={navLinks}
            session={!!session}
            theme={theme}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            navigate={navigate}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "../ui/button";
import { Menu, X, LogIn, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../ThemeProvider";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "../ui/use-toast";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileNav = ({ isOpen, setIsOpen }: MobileNavProps) => {
  const location = useLocation();
  const session = useSession();
  const navigate = useNavigate();
  const { role } = useUserRole();
  const { theme, setTheme } = useTheme();
  const supabase = useSupabaseClient();

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
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50 text-white hover:text-white/80"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-purple-900/95 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-lg font-medium text-white hover:text-white/80 transition-colors",
                location.pathname === link.path && "text-primary"
              )}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-white hover:text-white/80"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {session ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:text-white/80"
              >
                Atsijungti
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                className="text-white hover:text-white/80"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Prisijungti
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
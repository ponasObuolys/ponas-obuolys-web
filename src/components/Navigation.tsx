import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "./ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const { role } = useUserRole();

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

  const navLinks = [
    { name: "Pradžia", path: "/" },
    { name: "Vaizdo įrašai", path: "/videos" },
    { name: "Naujienos", path: "/naujienos" },
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
          <Link
            to="/"
            className="flex items-center space-x-3 text-2xl font-bold text-gray-800 dark:text-white hover:opacity-80 transition-opacity"
          >
            <img
              src="/lovable-uploads/0aa80ff9-7a2d-4961-ab31-ff1334112b79.png"
              alt="ponas Obuolys"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
            />
            <span>ponas Obuolys</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity px-3 py-2 rounded-md text-sm font-medium",
                  location.pathname === link.path && "text-primary font-semibold"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {session ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-800 dark:text-gray-100 hover:opacity-80"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Atsijungti
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-gray-800 dark:text-gray-100 hover:opacity-80"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Prisijungti
              </Button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-800 dark:text-gray-100"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-gray-100 hover:opacity-80 transition-opacity",
                    location.pathname === link.path &&
                      "text-primary font-semibold bg-gray-50 dark:bg-gray-800"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {session ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-800 dark:text-gray-100"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Atsijungti
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-800 dark:text-gray-100"
                  onClick={() => {
                    navigate("/auth");
                    setIsOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Prisijungti
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
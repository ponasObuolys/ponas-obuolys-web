import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "../ui/button";
import { Menu, X, LogIn, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "../ThemeProvider";
import { useUserRole } from "@/hooks/useUserRole";

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

  const navLinks = [
    { name: "Naujienos", path: "/naujienos" },
    { name: "YouTube", path: "/videos" },
    { name: "Įrankiai", path: "/irankiai" },
    { name: "Kontaktai", path: "/kontaktai" },
    { name: "Apie", path: "/apie" },
    ...(role === "admin" ? [{ name: "Admin", path: "/admin" }] : []),
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-800 dark:text-gray-100"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-64 bg-[#9b87f5] dark:bg-gray-900 overflow-y-auto max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-white hover:text-gray-200 py-2 text-lg font-medium transition-colors",
                    location.pathname === link.path && "text-white font-semibold"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setIsOpen(false);
                  }}
                  className="w-full justify-start text-white hover:text-gray-200"
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Šviesus režimas" : "Tamsus režimas"}
                </Button>
              </div>
              
              {!session && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:text-gray-200"
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
        </div>
      )}
    </div>
  );
};
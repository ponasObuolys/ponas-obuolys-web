import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { LogIn, LogOut, Menu, Sun, Moon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./types";

interface MobileNavProps {
  navLinks: NavLink[];
  session: boolean;
  theme: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => Promise<void>;
  toggleTheme: () => void;
  navigate: (path: string) => void;
}

export const MobileNav = ({
  navLinks,
  session,
  theme,
  isOpen,
  setIsOpen,
  handleLogout,
  toggleTheme,
  navigate,
}: MobileNavProps) => {
  const location = useLocation();

  return (
    <div className="md:hidden">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-gray-800 dark:text-gray-100 hover:opacity-80"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <button
          className="text-gray-800 dark:text-gray-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="animate-fadeIn">
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
  );
};
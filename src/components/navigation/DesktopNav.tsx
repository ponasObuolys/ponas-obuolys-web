import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { LogIn, LogOut, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "./types";

interface DesktopNavProps {
  navLinks: NavLink[];
  session: boolean;
  theme: string;
  handleLogout: () => Promise<void>;
  toggleTheme: () => void;
  navigate: (path: string) => void;
}

export const DesktopNav = ({
  navLinks,
  session,
  theme,
  handleLogout,
  toggleTheme,
  navigate,
}: DesktopNavProps) => {
  const location = useLocation();

  return (
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

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="text-gray-800 dark:text-gray-100 hover:opacity-80"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />
        )}
      </Button>

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
  );
};
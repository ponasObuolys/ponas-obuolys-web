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
            "dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80 transition-colors px-3 py-2 rounded-md text-sm font-medium",
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
        className="dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      {session ? (
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Atsijungti
        </Button>
      ) : (
        <Button
          variant="ghost"
          onClick={() => navigate("/prisijungimas")}
          className="dark:text-white text-gray-700 hover:text-gray-900 dark:hover:text-white/80"
        >
          <LogIn className="h-5 w-5 mr-2" />
          Prisijungti
        </Button>
      )}
    </div>
  );
};
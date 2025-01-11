import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";
import { NavLink } from "@/types/navigation";

interface DesktopNavProps {
  navLinks: NavLink[];
}

export const DesktopNav = ({ navLinks }: DesktopNavProps) => {
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
      <ThemeToggle />
      <AuthButton />
    </div>
  );
};
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthButton } from "./AuthButton";
import { NavLink } from "@/types/navigation";

interface MobileNavProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

export const MobileNav = ({ isOpen, navLinks, onClose }: MobileNavProps) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
          >
            {link.name}
          </Link>
        ))}
        <AuthButton isMobile />
      </div>
    </div>
  );
};
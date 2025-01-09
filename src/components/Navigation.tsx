import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { ThemeToggle } from "./navigation/ThemeToggle";
import { DesktopNav } from "./navigation/DesktopNav";
import { MobileNav } from "./navigation/MobileNav";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { role } = useUserRole();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Pradžia", path: "/" },
    { name: "Vaizdo įrašai", path: "/videos" },
    { name: "Kursai", path: "/courses" },
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

          <DesktopNav navLinks={navLinks} />

          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="text-gray-800 dark:text-gray-100"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <MobileNav
          isOpen={isOpen}
          navLinks={navLinks}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navigation;
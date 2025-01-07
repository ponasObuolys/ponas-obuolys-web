import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const { role } = useUserRole();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        isScrolled ? "bg-background/80 backdrop-blur-sm" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold">Your Site</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className={`text-sm font-medium ${
                location.pathname === "/" ? "text-foreground" : "text-foreground/60"
              } transition-colors hover:text-foreground`}
            >
              Home
            </Link>
            <Link
              to="/videos"
              className={`text-sm font-medium ${
                location.pathname === "/videos"
                  ? "text-foreground"
                  : "text-foreground/60"
              } transition-colors hover:text-foreground`}
            >
              Videos
            </Link>
            {role === "admin" && (
              <Link
                to="/admin"
                className={`text-sm font-medium ${
                  location.pathname.startsWith("/admin")
                    ? "text-foreground"
                    : "text-foreground/60"
                } transition-colors hover:text-foreground`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
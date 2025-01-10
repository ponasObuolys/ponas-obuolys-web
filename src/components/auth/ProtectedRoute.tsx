import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient<Database>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      console.log("ProtectedRoute: Checking access...");
      
      if (!session?.user) {
        console.log("ProtectedRoute: No session found, redirecting to auth");
        navigate("/auth", { replace: true });
        return;
      }

      if (requireAdmin) {
        console.log("ProtectedRoute: Checking admin role...");
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error checking user roles:", error);
          toast.error("Klaida tikrinant prieigos teises");
          navigate("/", { replace: true });
          return;
        }

        console.log("ProtectedRoute: User roles:", roles);
        
        // Check if user has admin role in any of their roles
        const isAdmin = roles?.some(role => role.role === "admin");
        
        if (!isAdmin) {
          console.log("ProtectedRoute: User is not admin, redirecting to home");
          toast.error("Neturite prieigos teisių");
          navigate("/", { replace: true });
          return;
        }
      }

      console.log("ProtectedRoute: Access granted");
      setHasAccess(true);
      setIsLoading(false);
    };

    checkAccess();
  }, [session, navigate, supabase, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
};
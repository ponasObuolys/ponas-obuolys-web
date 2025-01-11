import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute: Session state changed", { hasSession: !!session });
    
    if (session === null) {
      console.log("No session found, redirecting to auth page");
      navigate("/auth", { replace: true });
    }
  }, [session, navigate]);

  // Show loading spinner while session is being checked
  if (session === undefined) {
    console.log("ProtectedRoute: Loading session state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Only render children if we have a valid session
  return session ? <>{children}</> : null;
};
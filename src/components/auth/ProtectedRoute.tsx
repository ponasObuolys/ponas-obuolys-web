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
    if (session === null) {
      console.log("No session found, redirecting to auth page");
      navigate("/auth");
    }
  }, [session, navigate]);

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return session ? <>{children}</> : null;
};
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/auth", { state: { from: location } });
    }
  }, [session, isLoading, navigate, location]);

  // Show loading state or return null while checking auth
  if (isLoading) {
    return null;
  }

  // Only render children if authenticated
  return session ? <>{children}</> : null;
}
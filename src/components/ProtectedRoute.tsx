import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !session) {
      console.log("No session found, redirecting to auth", { from: location });
      navigate("/auth", { state: { from: location } });
    }
  }, [session, isLoading, navigate, location]);

  if (isLoading) {
    console.log("Checking authentication...");
    return null;
  }

  if (!session) {
    console.log("No session, rendering null");
    return null;
  }

  console.log("Session found, rendering protected content");
  return <>{children}</>;
}
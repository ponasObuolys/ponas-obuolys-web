import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AuthForm } from "@/components/auth/AuthForm";
import { getErrorMessage } from "@/utils/auth-errors";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isLoading && session) {
      console.log("Redirecting to admin, session found:", { session });
      navigate("/admin");
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change in Auth page:", { event, session });
      if (event === "SIGNED_IN") {
        navigate("/admin");
      }
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED") {
        setErrorMessage("");
      }
      if (event === "USER_UPDATED") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth error:", error);
          setErrorMessage(getErrorMessage(error));
          if (error.message.includes("refresh_token_not_found")) {
            await supabase.auth.signOut();
            navigate("/auth");
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AuthForm errorMessage={errorMessage} />
    </div>
  );
};

export default Auth;
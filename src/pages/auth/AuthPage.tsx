import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "@/components/ui/use-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLinks } from "@/components/auth/AuthLinks";
import { getErrorMessage } from "@/utils/auth";

export const AuthPage = () => {
  const navigate = useNavigate();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthPage: Session state changed", { hasSession: !!session });
    
    if (session) {
      console.log("Session found, redirecting to home");
      navigate("/");
    }
  }, [session, navigate]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in, redirecting to home");
          navigate("/");
        }
        if (event === "SIGNED_OUT") {
          setError(null);
        }
      }
    );

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Sėkmingai prisijungėte",
        description: "Sveiki sugrįžę!",
      });
    } catch (err: any) {
      setError(getErrorMessage(err));
      toast({
        variant: "destructive",
        title: "Klaida",
        description: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Prisijungimas</h1>
          <p className="text-muted-foreground mt-2">
            Prisijunkite prie savo paskyros
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthForm onSubmit={handleLogin} isLoading={loading} />
        <AuthLinks />
      </div>
    </div>
  );
};

export default AuthPage;
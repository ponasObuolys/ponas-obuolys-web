import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          navigate("/");
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
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Neteisingi prisijungimo duomenys. Patikrinkite el. paštą ir slaptažodį.";
      case "Email not confirmed":
        return "Prašome patvirtinti savo el. pašto adresą prieš prisijungiant.";
      case "Invalid Refresh Token: Refresh Token Not Found":
        return "Jūsų sesija baigėsi. Prašome prisijungti iš naujo.";
      default:
        return error.message;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Prisijungimas</h1>
          <p className="text-muted-foreground">
            Prisijunkite prie savo paskyros
          </p>
        </div>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "rgb(var(--primary))",
                    brandAccent: "rgb(var(--primary))",
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: "El. paštas",
                  password_label: "Slaptažodis",
                  button_label: "Prisijungti",
                },
                sign_up: {
                  email_label: "El. paštas",
                  password_label: "Slaptažodis",
                  button_label: "Registruotis",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
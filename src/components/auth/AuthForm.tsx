import { Alert, AlertDescription } from "@/components/ui/alert";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  errorMessage: string;
}

export function AuthForm({ errorMessage }: AuthFormProps) {
  return (
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
  );
}
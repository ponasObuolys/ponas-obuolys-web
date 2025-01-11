import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { getErrorMessage } from "@/utils/auth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Registracija sėkminga",
        description: "Prašome patvirtinti el. paštą.",
      });
      
      navigate("/auth");
    } catch (err: any) {
      console.error("Registration error:", err);
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
          <h1 className="text-2xl font-bold">Registracija</h1>
          <p className="text-muted-foreground mt-2">
            Sukurkite naują paskyrą
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="animate-fadeIn">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthForm 
          onSubmit={handleRegister} 
          isLoading={loading}
          submitText="Registruotis"
        />

        <div className="text-center">
          <button
            onClick={() => navigate("/auth")}
            className="text-primary hover:text-primary/90 transition-colors font-medium"
          >
            Jau turite paskyrą? Prisijunkite
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type AuthError = {
  message: string;
};

export const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/");
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Neteisingi prisijungimo duomenys. Patikrinkite el. paštą ir slaptažodį.";
      case "Email not confirmed":
        return "Prašome patvirtinti savo el. pašto adresą prieš prisijungiant.";
      default:
        return "Įvyko klaida. Bandykite dar kartą vėliau.";
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

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">El. paštas</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jusu@pastas.lt"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Slaptažodis</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Įveskite slaptažodį"
              required
              disabled={loading}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? <LoadingSpinner /> : "Prisijungti"}
          </Button>
        </form>

        <div className="space-y-4 text-center text-sm">
          <button
            onClick={() => navigate("/auth/reset-password")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pamiršote slaptažodį?
          </button>
          <div className="flex items-center justify-center space-x-1">
            <span className="text-muted-foreground">Neturite paskyros?</span>
            <button
              onClick={() => navigate("/auth/register")}
              className="text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              Registruotis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
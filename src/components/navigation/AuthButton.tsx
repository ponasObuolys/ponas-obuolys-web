import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "../ui/use-toast";

export const AuthButton = ({ isMobile = false }: { isMobile?: boolean }) => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Nepavyko atsijungti. Bandykite dar kartą.",
      });
    } else {
      navigate("/");
    }
  };

  if (session) {
    return (
      <Button
        variant="ghost"
        size={isMobile ? "default" : "sm"}
        onClick={handleLogout}
        className={`text-gray-800 dark:text-gray-100 hover:opacity-80 ${
          isMobile ? "w-full justify-start" : ""
        }`}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Atsijungti
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={isMobile ? "default" : "sm"}
      onClick={() => navigate("/auth")}
      className={`text-gray-800 dark:text-gray-100 hover:opacity-80 ${
        isMobile ? "w-full justify-start" : ""
      }`}
    >
      <LogIn className="mr-2 h-4 w-4" />
      Prisijungti
    </Button>
  );
};
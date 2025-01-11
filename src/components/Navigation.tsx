import { Link } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Klaida",
        description: "Nepavyko atsijungti. Bandykite dar kartą.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sėkmingai atsijungėte",
        description: "Iki kito karto! 👋",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex gap-6 items-center">
            <Link to="/" className="text-xl font-bold">
              AI Akademija
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/irankiai" className="hover:text-primary transition-colors">
                Įrankiai
              </Link>
              <Link to="/videos" className="hover:text-primary transition-colors">
                Video
              </Link>
              <Link to="/kontaktai" className="hover:text-primary transition-colors">
                Kontaktai
              </Link>
              <Link to="/apie" className="hover:text-primary transition-colors">
                Apie
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link to="/admin">
                  <Button variant="outline">Admin</Button>
                </Link>
                <Button onClick={handleSignOut} variant="ghost">
                  Atsijungti
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>Prisijungti</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
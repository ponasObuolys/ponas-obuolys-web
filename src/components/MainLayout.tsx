import { useSession } from "@supabase/auth-helpers-react";
import Navigation from "./Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  console.log("MainLayout rendered with session:", !!session);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
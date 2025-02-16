import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "./Navigation";
import Footer from "./footer/Footer";
import { Helmet } from "react-helmet";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  console.log("MainLayout rendered with session:", !!session);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>ponas Obuolys - Edukacinis turinys</title>
        <meta name="description" content="Edukacinis turinys, vaizdo įrašai ir naujienos iš ponas Obuolys." />
        <meta name="keywords" content="ponas obuolys, edukacija, mokymai, vaizdo įrašai" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ponas Obuolys - Edukacinis turinys" />
        <meta property="og:description" content="Edukacinis turinys, vaizdo įrašai ir naujienos iš ponas Obuolys." />
        <meta property="og:image" content="/lovable-uploads/0aa80ff9-7a2d-4961-ab31-ff1334112b79.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navigation />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
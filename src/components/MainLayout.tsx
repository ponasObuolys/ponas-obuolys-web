import { useSession } from "@supabase/auth-helpers-react";
import { Navigation } from "./Navigation";
import Footer from "./footer/Footer";
import { Helmet } from "react-helmet";
import { ScrollToTop } from "./ui/ScrollToTop";
import { BackToTop } from "./ui/BackToTop";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const session = useSession();
  console.log("MainLayout rendered with session:", !!session);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>ponas Obuolys - Dirbtinis Intelektas Paprastai</title>
        <meta name="description" content="Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą. Mokykitės apie AI paprastai ir suprantamai." />
        <meta name="keywords" content="ponas obuolys, dirbtinis intelektas, AI, technologijos, mokymai, vaizdo įrašai, edukacija, lietuva" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="ponas Obuolys" />
        <meta name="language" content="lt" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ponas Obuolys - Dirbtinis Intelektas Paprastai" />
        <meta property="og:description" content="Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą. Mokykitės apie AI paprastai ir suprantamai." />
        <meta property="og:image" content="/lovable-uploads/0aa80ff9-7a2d-4961-ab31-ff1334112b79.png" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:site_name" content="ponas Obuolys" />
        <meta property="og:locale" content="lt_LT" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ponas Obuolys - Dirbtinis Intelektas Paprastai" />
        <meta name="twitter:description" content="Atraskite įdomų turinį, straipsnius ir vaizdo įrašus apie dirbtinį intelektą, technologijas ir skaitmeninį gyvenimą." />
        <meta name="twitter:image" content="/lovable-uploads/0aa80ff9-7a2d-4961-ab31-ff1334112b79.png" />
        
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Navigation />
      <BackToTop />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
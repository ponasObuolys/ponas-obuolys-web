import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Index from "@/pages/Index";
import Videos from "@/pages/Videos";
import Tools from "@/pages/Tools";
import Contact from "@/pages/Kontaktai";
import About from "@/pages/Apie";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/auth/AuthPage";
import { supabase } from "./integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <div className="min-h-screen bg-background font-quicksand text-foreground">
              <Navigation />
              <main className="container mx-auto px-4 pt-20 pb-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/irankiai" element={<Tools />} />
                  <Route path="/kontaktai" element={<Contact />} />
                  <Route path="/apie" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;
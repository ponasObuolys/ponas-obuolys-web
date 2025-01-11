import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Videos from "@/pages/Videos";
import News from "@/pages/News";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/auth/AuthPage";
import RegisterPage from "@/pages/auth/Register";
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
                  <Route path="/" element={<Home />} />
                  <Route path="/videos" element={<Videos />} />
                  <Route path="/naujienos" element={<News />} />
                  <Route path="/kontaktai" element={<Contact />} />
                  <Route path="/apie" element={<About />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                </Routes>
              </main>
            </div>
          </Router>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;
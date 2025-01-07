import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const supabaseUrl = "https://ivwmiwagadrjnvudagio.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2d21pd2FnYWRyam52dWRhZ2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNzE0MjksImV4cCI6MjA1MTg0NzQyOX0.HypRNSZnxWpGIy7HSNJ_HUGmlLh2181RnXnAQII0b9s";
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
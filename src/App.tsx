import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root } from "@/components/Root";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, Suspense, lazy, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Lazy load pages
const Index = lazy(() => import("@/pages/Index"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Editor = lazy(() => import("@/pages/Editor"));
const PostEditor = lazy(() => import("@/pages/PostEditor"));
const Admin = lazy(() => import("@/pages/Admin"));
const Settings = lazy(() => import("@/pages/Settings"));
const Videos = lazy(() => import("@/pages/Videos"));
const Kontaktai = lazy(() => import("@/pages/Kontaktai"));
const Apie = lazy(() => import("@/pages/Apie"));
const Irankiai = lazy(() => import("@/pages/Irankiai"));
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Add future flags configuration
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("App component rendered");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test Supabase connection
        const { error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError('Kažkas nepavyko inicializuojant programą. Bandykite dar kartą vėliau.');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-4">
          <h1 className="text-xl font-semibold mb-2">Klaida</h1>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Bandyti dar kartą
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SessionContextProvider supabaseClient={supabase}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter future={routerFutureConfig}>
              <Routes>
                {/* Auth routes outside of Root layout */}
                <Route path="/prisijungimas" element={<AuthPage />} />
                
                {/* All other routes within Root layout */}
                <Route element={<Root />}>
                  <Route index element={<Index />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="irankiai" element={<Irankiai />} />
                  <Route path="video" element={<Videos />} />
                  <Route path="apie-mus" element={<Apie />} />
                  <Route path="kontaktai" element={<Kontaktai />} />
                  
                  {/* Protected admin routes */}
                  <Route
                    path="admin/*"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="redaktorius"
                    element={
                      <ProtectedRoute>
                        <Editor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="redaktorius/:id"
                    element={
                      <ProtectedRoute>
                        <PostEditor />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="nustatymai"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </SessionContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
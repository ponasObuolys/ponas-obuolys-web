import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root } from "@/components/Root";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, Suspense, lazy } from "react";
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

const queryClient = new QueryClient();

function App() {
  console.log("App component rendered");

  // Handle system dark mode preference
  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }

    const darkModeListener = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    darkModeListener.addEventListener('change', handleDarkModeChange);
    return () => darkModeListener.removeEventListener('change', handleDarkModeChange);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Auth routes outside of Root layout */}
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* All other routes within Root layout */}
                  <Route element={<Root />}>
                    <Route index element={<Index />} />
                    <Route path="naujienos" element={<Blog />} />
                    <Route path="naujienos/:slug" element={<BlogPost />} />
                    <Route path="irankiai" element={<Irankiai />} />
                    <Route
                      path="editor"
                      element={
                        <ProtectedRoute>
                          <Editor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="editor/:id"
                      element={
                        <ProtectedRoute>
                          <PostEditor />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="admin/*"
                      element={
                        <ProtectedRoute>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="videos" element={<Videos />} />
                    <Route path="kontaktai" element={<Kontaktai />} />
                    <Route path="apie" element={<Apie />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
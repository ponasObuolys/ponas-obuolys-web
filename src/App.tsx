import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Root } from "@/components/Root";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Editor from "@/pages/Editor";
import PostEditor from "@/pages/PostEditor";
import Admin from "@/pages/Admin";
import Settings from "@/pages/Settings";
import Videos from "@/pages/Videos";
import { NotFound } from "@/components/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import AuthPage from "@/pages/auth/AuthPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function App() {
  console.log("App component rendered");
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                {/* Auth routes outside of Root layout */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* All other routes within Root layout */}
                <Route element={<Root />}>
                  <Route index element={<Index />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
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
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
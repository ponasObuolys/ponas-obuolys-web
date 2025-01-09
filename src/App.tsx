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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route element={<Root />}>
                <Route index element={<Index />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="editor" element={<Editor />} />
                <Route path="editor/:id" element={<PostEditor />} />
                <Route path="admin/*" element={<Admin />} />
                <Route path="settings" element={<Settings />} />
                <Route path="videos" element={<Videos />} />
              </Route>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
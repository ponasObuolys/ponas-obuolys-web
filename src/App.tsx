import { Routes, Route } from "react-router-dom";
import Root from "@/components/Root";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import Editor from "@/pages/Editor";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Index />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:id?"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
      </Route>
    </Routes>
  );
}
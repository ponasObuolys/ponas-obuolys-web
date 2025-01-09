import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import Root from "@/components/Root";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import Editor from "@/pages/Editor";
import Settings from "@/pages/Settings";
import Videos from "@/pages/Videos";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <MainLayout>
            <Index />
          </MainLayout>
        ),
      },
      {
        path: "/blog",
        element: (
          <MainLayout>
            <Blog />
          </MainLayout>
        ),
      },
      {
        path: "/blog/:slug",
        element: (
          <MainLayout>
            <BlogPost />
          </MainLayout>
        ),
      },
      {
        path: "/admin",
        element: (
          <MainLayout>
            <Admin />
          </MainLayout>
        ),
      },
      {
        path: "/editor/:id?",
        element: (
          <MainLayout>
            <Editor />
          </MainLayout>
        ),
      },
      {
        path: "/settings",
        element: (
          <MainLayout>
            <Settings />
          </MainLayout>
        ),
      },
      {
        path: "/videos",
        element: (
          <MainLayout>
            <Videos />
          </MainLayout>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
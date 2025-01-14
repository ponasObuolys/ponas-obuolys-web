import React from "react";
import Navigation from "@/components/Navigation";
import AdminDarkTheme from "./AdminDarkTheme";
import { useTheme } from "@/components/ThemeProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen admin-panel ${theme === 'dark' ? 'dark' : ''}`}>
      <AdminDarkTheme />
      <Navigation />
      <div className="pt-20 px-6 md:px-6">
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
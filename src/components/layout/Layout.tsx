import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import FloatingHomeButton from "../FloatingHomeButton";
import FloatingCartButton from "../FloatingCartButton";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-clip">
      <Header />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip">
        <Toaster />
        {children}
      </main>
      <FloatingHomeButton />
      <FloatingCartButton />
      <Footer />
    </div>
  );
};

export default Layout;

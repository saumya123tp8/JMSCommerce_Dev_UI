import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
// import FloatingCartButton from "../../pages/FloatingCartButton";
// import FloatingHomeButton from "../../pages/FloatingHomeButton";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  // title = "jms-ecommerce",
  // description = "name of maximum project",
  // keywords = "online,shop,product",
  // author = "tony",
}) => {
  // return (
  //   <div>
  //     {/* <Helmet>
  //       <meta charSet="utf-8" />
  //       <meta name="description" content={description} />
  //       <meta name="keywords" content={keywords} />
  //       <meta name="author" content={author} />
  //       <title>{title}</title>
  //     </Helmet> */}
  //     <Header />
  //     <main style={{ minHeight: "70vh" }} className="pt-16 md:pt-20">
  //       <Toaster />
  //       {children}
  //     </main>
  //     {/* <FloatingCartButton /> */}
  //     {/* <FloatingHomeButton /> */}
  //     <Footer />
  //   </div>
  // );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
  
      <main className="flex-1 pt-16 md:pt-20">
        <Toaster />
        {children}
      </main>
  
      <Footer />
    </div>
  );
};

export default Layout;

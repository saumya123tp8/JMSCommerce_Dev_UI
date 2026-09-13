import React from "react";
import Header from "./Header";
import Footer from "./Footer";
// import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import FloatingHomeButton from "../FloatingHomeButton";
import FloatingCartButton from "../FloatingCartButton";
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
    <div className="flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-clip">
      <Header />
      <main className="min-w-0 w-full max-w-full flex-1 overflow-x-clip pt-[120px] md:pt-20">
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

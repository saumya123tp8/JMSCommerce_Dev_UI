import { Link, Outlet, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";

import {
  LayoutDashboard,
  FolderTree,
  ListChecks,
  Plus,
  Package,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

import Layout from "@/components/layout/Layout";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  matchPrefix: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard/admin",
    icon: LayoutDashboard,
    matchPrefix: "/dashboard/admin",
  },
  {
    label: "Orders",
    to: "/dashboard/admin/orders",
    icon: ShoppingBag,
    matchPrefix: "/dashboard/admin/orders",
  },
  {
    label: "Reports",
    to: "/dashboard/admin/reports",
    icon: MessageSquare,
    matchPrefix: "/dashboard/admin/reports",
  },
  {
    label: "Categories",
    to: "/dashboard/admin/categories",
    icon: FolderTree,
    matchPrefix: "/dashboard/admin/categor",
  },
  {
    label: "Products",
    to: "/dashboard/admin/products",
    icon: Package,
    matchPrefix: "/dashboard/admin/product",
  },
  {
    label: "Specifications",
    to: "/dashboard/admin/specifications",
    icon: ListChecks,
    matchPrefix: "/dashboard/admin/specification",
  },
];

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // const isActive = (item: NavItem) => {
  //   return (
  //     location.pathname === item.matchPrefix ||
  //     location.pathname.startsWith(item.matchPrefix + "/") ||
  //     (item.matchPrefix === "/dashboard/admin/categor" &&
  //       location.pathname.startsWith("/dashboard/admin/categor")) ||
  //     (item.matchPrefix === "/dashboard/admin/specification" &&
  //       location.pathname.startsWith(
  //         "/dashboard/admin/specification"
  //       )) ||
  //     (item.matchPrefix === "/dashboard/admin/product" &&
  //       location.pathname.startsWith("/dashboard/admin/products")) ||
  //     (item.matchPrefix === "/dashboard/admin/orders" &&
  //       location.pathname.startsWith("/dashboard/admin/orders")) ||
  //     (item.matchPrefix === "/dashboard/admin/reports" &&
  //       location.pathname.startsWith("/dashboard/admin/reports"))
  //   );
  // };
  const isActive = (item: NavItem) => {
    // Dashboard should ONLY be active on the dashboard root
    if (item.to === "/dashboard/admin") {
      return location.pathname === "/dashboard/admin";
    }
  
    // Every other item is active for itself and its nested routes
    return (
      location.pathname === item.to ||
      location.pathname.startsWith(item.to + "/")
    );
  };

  return (
    <Layout>
      <div className="flex min-h-dvh min-w-0 w-full bg-[#FAF7F2]">

        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden w-60 shrink-0 border-r border-[#E8DDD0] bg-white md:block">
          <div className="sticky top-0">
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">
                Admin
              </p>

              <h2 className="mt-1 font-serif text-xl text-[#2E1F14]">
                Ambani Coffee
              </h2>
            </div>

            <nav className="flex flex-col gap-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item)
                        ? "bg-[#2E1F14] text-white"
                        : "text-[#5C4A3A] hover:bg-[#F3EAE0]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Add */}
            <div className="mt-6 border-t border-[#E8DDD0] px-3 pt-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quick Add
              </p>

              <Link
                to="/dashboard/admin/create-category"
                className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F3EAE0]"
              >
                <Plus className="h-4 w-4 shrink-0" />
                New Category
              </Link>

              <Link
                to="/dashboard/admin/specifications/new"
                className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F3EAE0]"
              >
                <Plus className="h-4 w-4 shrink-0" />
                New Specification
              </Link>
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="min-w-0 flex-1">

          {/* MOBILE ADMIN NAV */}
          <nav
            className="
              sticky
              top-0
              z-30
              flex
              w-full
              min-w-0
              overflow-x-auto
              border-b
              border-[#E8DDD0]
              bg-[#FAF7F2]/95
              px-3
              py-2
              shadow-[0_2px_10px_rgba(46,31,20,0.04)]
              backdrop-blur-md
              md:hidden
            "
          >
            <div className="flex min-w-max gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      `
                        flex
                        min-h-10
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        text-xs
                        font-medium
                        whitespace-nowrap
                        transition-colors
                        active:scale-[0.98]
                      `,
                      active
                        ? "bg-[#2E1F14] text-white shadow-sm"
                        : "text-[#5C4A3A] hover:bg-[#F3EAE0]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* PAGE CONTENT */}
          <div className="min-w-0 w-full">
            <Outlet />
          </div>

        </main>
      </div>
    </Layout>
  );
};

export default AdminLayout;
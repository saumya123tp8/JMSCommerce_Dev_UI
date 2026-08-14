import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderTree, ListChecks, Plus } from "lucide-react";
import Layout from "@/components/layout/Layout";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
  // matches this path AND any nested route under it (e.g. edit pages)
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
    label: "Categories",
    to: "/dashboard/admin/categories",
    icon: FolderTree,
    matchPrefix: "/dashboard/admin/categor", // catches /category/:id too
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

  return (
    <Layout>
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-[#E8DDD0] bg-white md:block">
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
            const isActive =
              location.pathname === item.matchPrefix ||
              location.pathname.startsWith(item.matchPrefix + "/") ||
              (item.matchPrefix === "/dashboard/admin/categor" &&
                location.pathname.startsWith("/dashboard/admin/categor")) ||
              (item.matchPrefix === "/dashboard/admin/specification" &&
                location.pathname.startsWith("/dashboard/admin/specification"));

            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#2E1F14] text-white"
                    : "text-[#5C4A3A] hover:bg-[#F3EAE0]"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-[#E8DDD0] px-3 pt-6">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Quick Add
          </p>
          <Link
            to="/dashboard/admin/create-category"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F3EAE0]"
          >
            <Plus className="h-4 w-4" />
            New Category
          </Link>
          <Link
            to="/dashboard/admin/specifications/new"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#5C4A3A] hover:bg-[#F3EAE0]"
          >
            <Plus className="h-4 w-4" />
            New Specification
          </Link>
        </div>
      </aside>

      {/* Mobile top tabs (shown instead of sidebar on small screens) */}
      <div className="fixed inset-x-0 top-0 z-40 flex overflow-x-auto border-b border-[#E8DDD0] bg-white px-2 py-2 md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.matchPrefix);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium",
                isActive
                  ? "bg-[#2E1F14] text-white"
                  : "text-[#5C4A3A]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
    </Layout>
  );
};

export default AdminLayout;
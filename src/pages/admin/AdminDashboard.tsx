
// import { Link } from "react-router-dom";
// import { buttonVariants } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// import { useOrders } from "@/hooks/useOrders";
// import { useAdminOrderReports } from "@/hooks/useAdminOrderReports";
// import { computeDashboardStats } from "@/lib/dashboardStats";
// // import { cn } from "@/lib/utils";
// import { IndianRupee, Package, Clock, MessageSquare } from "lucide-react";

// const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
//   icon: Icon, label, value,
// }) => (
//   <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
//     <div className="mb-2 flex items-center gap-2 text-muted-foreground">
//       <Icon className="h-4 w-4" />
//       <span className="text-xs uppercase tracking-wide">{label}</span>
//     </div>
//     <p className="font-serif text-2xl text-[#2E1F14]">{value}</p>
//   </div>
// );

// const AdminDashboard = () => {
  
//   const { orders, loading: ordersLoading } = useOrders();
//   const { reports, loading: reportsLoading } = useAdminOrderReports("ALL");


//   const stats = computeDashboardStats(orders, reports);
//   const statsLoading = ordersLoading || reportsLoading;

//   return (
//     <section className="p-6">
//       <div className="mb-8">
//         <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">Admin</p>
//         <h1 className="font-serif text-3xl text-[#2E1F14]">Dashboard</h1>
//       </div>

//       {/* Stat cards */}
//       <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
//         {statsLoading ? (
//           <p className="col-span-4 text-sm text-muted-foreground">Loading stats...</p>
//         ) : (
//           <>
//             <StatCard icon={IndianRupee} label="Revenue (paid orders)" value={`₹${stats.totalRevenue.toFixed(0)}`} />
//             <StatCard icon={Package} label="Total Orders" value={String(stats.totalOrders)} />
//             <StatCard icon={Clock} label="Active Orders" value={String(stats.activeOrders)} />
//             <StatCard icon={MessageSquare} label="Open Reports" value={String(stats.openReports)} />
//           </>
//         )}
//       </div>

//       <div className="mb-8 flex flex-wrap gap-3">
//         <Link to="/dashboard/admin/reports" className={buttonVariants({ variant: "outline" })}>
//           View Order Reports
//         </Link>
//         <Link to="/dashboard/admin/orders" className={buttonVariants({ variant: "outline" })}>
//           View Orders
//         </Link>
      
//       </div>

    
//     </section>
//   );
// };

// export default AdminDashboard;



import { Link } from "react-router-dom";

import { buttonVariants } from "@/components/ui/button";

import { useOrders } from "@/hooks/useOrders";
import { useAdminOrderReports } from "@/hooks/useAdminOrderReports";
import { computeDashboardStats } from "@/lib/dashboardStats";

import {
  IndianRupee,
  Package,
  Clock,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
}> = ({ icon: Icon, label, value }) => (
  <div
    className="
      min-w-0
      rounded-2xl
      border border-[#E8DDD0]
      bg-white
      p-4
      shadow-[0_4px_18px_rgba(46,31,20,0.04)]
      transition-shadow
      sm:p-5
    "
  >
    <div className="mb-3 flex min-w-0 items-center gap-2 text-muted-foreground">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F7EFE7] text-[#5C4A3A]">
        <Icon className="h-4 w-4" />
      </div>

      <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.12em] sm:text-xs sm:tracking-wide">
        {label}
      </span>
    </div>

    <p className="truncate font-serif text-2xl font-medium text-[#2E1F14] sm:text-3xl">
      {value}
    </p>
  </div>
);

const AdminDashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { reports, loading: reportsLoading } =
    useAdminOrderReports("ALL");

  const stats = computeDashboardStats(orders, reports);
  const statsLoading = ordersLoading || reportsLoading;

  return (
    <section className="min-w-0 w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C9A96E] sm:mb-2 sm:text-xs sm:tracking-[0.35em]">
            Admin
          </p>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate font-serif text-3xl leading-tight text-[#2E1F14] sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-2">
                Overview of your store activity and orders.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-7 sm:mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#2E1F14] sm:text-base">
              Overview
            </h2>

            {!statsLoading && (
              <span className="text-[11px] text-muted-foreground sm:text-xs">
                Current statistics
              </span>
            )}
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="
                    h-[112px]
                    animate-pulse
                    rounded-2xl
                    border
                    border-[#E8DDD0]
                    bg-white
                    sm:h-[130px]
                  "
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <StatCard
                icon={IndianRupee}
                label="Revenue"
                value={`₹${stats.totalRevenue.toFixed(0)}`}
              />

              <StatCard
                icon={Package}
                label="Total Orders"
                value={String(stats.totalOrders)}
              />

              <StatCard
                icon={Clock}
                label="Active Orders"
                value={String(stats.activeOrders)}
              />

              <StatCard
                icon={MessageSquare}
                label="Open Reports"
                value={String(stats.openReports)}
              />
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-[#2E1F14] sm:text-base">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Manage orders and customer reports.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <Link
              to="/dashboard/admin/reports"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7EFE7]">
                  <MessageSquare className="h-4 w-4 text-[#5C4A3A]" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    Order Reports
                  </span>

                  <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                    Review customer issues
                  </span>
                </span>
              </span>

              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>

            <Link
              to="/dashboard/admin/orders"
              className={buttonVariants({
                variant: "outline",
              })}
            >
              <span className="flex min-w-0 flex-1 items-center gap-3 text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7EFE7]">
                  <Package className="h-4 w-4 text-[#5C4A3A]" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate font-semibold">
                    Orders
                  </span>

                  <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                    View and manage orders
                  </span>
                </span>
              </span>

              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
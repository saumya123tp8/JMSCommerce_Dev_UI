
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/useOrders";
import { useAdminOrderReports } from "@/hooks/useAdminOrderReports";
import { computeDashboardStats } from "@/lib/dashboardStats";
import { cn } from "@/lib/utils";
import { IndianRupee, Package, Clock, MessageSquare } from "lucide-react";

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon, label, value,
}) => (
  <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
    <div className="mb-2 flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" />
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
    <p className="font-serif text-2xl text-[#2E1F14]">{value}</p>
  </div>
);

const AdminDashboard = () => {
  
  const { orders, loading: ordersLoading } = useOrders();
  const { reports, loading: reportsLoading } = useAdminOrderReports("ALL");


  const stats = computeDashboardStats(orders, reports);
  const statsLoading = ordersLoading || reportsLoading;

  return (
    <section className="p-6">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#C9A96E]">Admin</p>
        <h1 className="font-serif text-3xl text-[#2E1F14]">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsLoading ? (
          <p className="col-span-4 text-sm text-muted-foreground">Loading stats...</p>
        ) : (
          <>
            <StatCard icon={IndianRupee} label="Revenue (paid orders)" value={`₹${stats.totalRevenue.toFixed(0)}`} />
            <StatCard icon={Package} label="Total Orders" value={String(stats.totalOrders)} />
            <StatCard icon={Clock} label="Active Orders" value={String(stats.activeOrders)} />
            <StatCard icon={MessageSquare} label="Open Reports" value={String(stats.openReports)} />
          </>
        )}
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link to="/dashboard/admin/reports" className={buttonVariants({ variant: "outline" })}>
          View Order Reports
        </Link>
        <Link to="/dashboard/admin/orders" className={buttonVariants({ variant: "outline" })}>
          View Orders
        </Link>
      
      </div>

    
    </section>
  );
};

export default AdminDashboard;
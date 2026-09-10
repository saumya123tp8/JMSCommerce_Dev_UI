// lib/dashboardStats.ts
import type { Order } from "@/types/order";
import type { AdminOrderReportSummary } from "@/types/orderReport";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingPaymentOrders: number;
  activeOrders: number; // not yet DELIVERED or CANCELLED
  openReports: number;
}

export const computeDashboardStats = (
  orders: Order[],
  reports: AdminOrderReportSummary[]
): DashboardStats => ({
  totalOrders: orders.length,
  totalRevenue: orders
    .filter((o) => o.paymentStatus === "SUCCESS")
    .reduce((sum, o) => sum + o.grandTotal, 0),
  pendingPaymentOrders: orders.filter((o) => o.paymentStatus === "PENDING").length,
  activeOrders: orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.orderStatus)).length,
  openReports: reports.filter((r) => r.status === "OPEN" || r.status === "IN_REVIEW").length,
});
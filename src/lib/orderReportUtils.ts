import type { OrderReportReason, OrderReportStatus, ResolutionType } from "@/types/orderReport";

export const reportReasonLabels: Record<OrderReportReason, string> = {
  WRONG_ITEM_DELIVERED: "Wrong item delivered",
  ORDER_NOT_RECEIVED: "Order not received",
  POOR_PACKAGING: "Poor packaging",
  LATE_DELIVERY: "Late delivery",
  OTHER: "Other",
};

export const resolutionTypeLabels: Record<ResolutionType, string> = {
  REFUND: "Refund",
  REPLACEMENT: "Replacement",
  CREDIT: "Store Credit",
  COMPENSATION: "Compensation",
  NO_ACTION: "No Action",
  OTHER: "Other",
};

// Confirmed transitions per the Order Report API doc — invalid
// transitions are rejected server-side with 400, but we mirror the
// rule client-side so the UI only ever offers valid next steps.
export const allowedReportTransitions: Record<OrderReportStatus, OrderReportStatus[]> = {
  OPEN: ["IN_REVIEW", "REJECTED"],
  IN_REVIEW: ["RESOLVED", "REJECTED"],
  RESOLVED: ["CLOSED"],
  REJECTED: ["CLOSED"],
  CLOSED: [],
};

export const reportStatusBadgeVariant = (
  status: OrderReportStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "RESOLVED": return "default";
    case "REJECTED": return "destructive";
    case "OPEN": return "outline";
    default: return "secondary";
  }
};

// Messages/resolution actions are only meaningful while the report
// is still open for conversation, per the doc's explicit rule.
export const isReportOpenForActivity = (status: OrderReportStatus): boolean =>
  status !== "RESOLVED" && status !== "REJECTED" && status !== "CLOSED";
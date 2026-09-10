export type OrderReportStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED" | "CLOSED";
export type OrderReportReason =
  | "WRONG_ITEM_DELIVERED" | "ORDER_NOT_RECEIVED" | "POOR_PACKAGING" | "LATE_DELIVERY" | "OTHER";
export type ResolutionType =
  | "REFUND" | "REPLACEMENT" | "CREDIT" | "COMPENSATION" | "NO_ACTION" | "OTHER";

export interface OrderReportSummary {
  id: number;
  orderId: number;
  orderNumber: string;
  reason: OrderReportReason;
  status: OrderReportStatus;
  createdAt: string;
  updatedAt: string;
}

// Admin list view includes customer identity — user view doesn't.
export interface AdminOrderReportSummary extends OrderReportSummary {
  userId: number;
  userName: string;
  userEmail: string;
}

export interface ReportMessage {
  id: number;
  senderType: "USER" | "ADMIN";
  message: string;
  createdAt: string;
}

export interface ReportResolution {
  type: ResolutionType;
  message: string;
  resolvedAt: string | null;
}

export interface OrderReportDetail {
  id: number;
  orderId: number;
  orderNumber: string;
  reason: OrderReportReason;
  description: string;
  status: OrderReportStatus;
  createdAt: string;
  updatedAt: string;
  messages: ReportMessage[];
  resolution: ReportResolution | null;
}

export interface CreateReportPayload {
  reason: OrderReportReason;
  description: string;
}

export interface AddMessagePayload {
  message: string;
}

export interface UpdateStatusPayload {
  status: OrderReportStatus;
}

export interface ResolveReportPayload {
  type: ResolutionType;
  message: string;
}

export interface AddReportMessagePayload {
  message: string;
}
import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type {
  OrderReportSummary, OrderReportDetail, CreateReportPayload, ReportMessage,OrderReportStatus,
  AddMessagePayload,AdminOrderReportSummary,UpdateStatusPayload,ResolveReportPayload
} from "../types/orderReport";

export const createOrderReport = async (
  orderId: number,
  payload: CreateReportPayload
): Promise<OrderReportDetail> => {
  const { data } = await ApiClient.post<ApiResponse<OrderReportDetail>>(`/orders/${orderId}/reports`, payload);
  return data.data;
};

export const getMyOrderReports = async (): Promise<OrderReportSummary[]> => {
  const { data } = await ApiClient.get<ApiResponse<OrderReportSummary[]>>("/users/me/order-reports");
  return data.data;
};

export const getOrderReportDetail = async (reportId: number): Promise<OrderReportDetail> => {
  const { data } = await ApiClient.get<ApiResponse<OrderReportDetail>>(`/order-reports/${reportId}`);
  return data.data;
};
export const addReportMessage = async (
  reportId: number,
  payload: AddMessagePayload
): Promise<ReportMessage> => {
  const { data } = await ApiClient.post<ApiResponse<ReportMessage>>(
    `/order-reports/${reportId}/messages`,
    payload
  );
  return data.data;
};

// ---- Admin endpoints ----

export const getAllOrderReportsAdmin = async (
  status?: OrderReportStatus
): Promise<AdminOrderReportSummary[]> => {
  const { data } = await ApiClient.get<ApiResponse<AdminOrderReportSummary[]>>(
    "/admin/order-reports",
    { params: status ? { status } : undefined }
  );
  return data.data;
};

export const getOrderReportDetailAdmin = async (reportId: number): Promise<OrderReportDetail> => {
  const { data } = await ApiClient.get<ApiResponse<OrderReportDetail>>(
    `/admin/order-reports/${reportId}`
  );
  return data.data;
};

export const updateReportStatus = async (
  reportId: number,
  payload: UpdateStatusPayload
): Promise<OrderReportDetail> => {
  const { data } = await ApiClient.patch<ApiResponse<OrderReportDetail>>(
    `/admin/order-reports/${reportId}/status`,
    payload
  );
  return data.data;
};

export const addAdminReportMessage = async (
  reportId: number,
  payload: AddMessagePayload
): Promise<ReportMessage> => {
  const { data } = await ApiClient.post<ApiResponse<ReportMessage>>(
    `/admin/order-reports/${reportId}/messages`,
    payload
  );
  return data.data;
};

export const resolveOrderReport = async (
  reportId: number,
  payload: ResolveReportPayload
): Promise<OrderReportDetail> => {
  const { data } = await ApiClient.post<ApiResponse<OrderReportDetail>>(
    `/admin/order-reports/${reportId}/resolve`,
    payload
  );
  return data.data;
};
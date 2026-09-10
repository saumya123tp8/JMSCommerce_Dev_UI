import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Order, OrderStatus,CreateOrderPayload } from "../types/order";



const BASE = "/order";

export const getAllOrdersAdmin = async (): Promise<Order[]> => {
  const { data } = await ApiClient.get<ApiResponse<Order[]>>(`${BASE}/admin-all`);
  return data.data;
};

// ASSUMPTION: no update-status endpoint was documented. This is the
// conventional REST shape for it — confirm the real path/method/body
// with backend before relying on this.
export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus
): Promise<Order> => {
  const { data } = await ApiClient.put<ApiResponse<Order>>(
    `${BASE}/${orderId}/status`,
    { status }
  );
  return data.data;
};

// NOTE: the sample delete response returns the full remaining order
// list in `data`, not a single deleted record — unusual for a DELETE
// endpoint. Using it defensively: if it's an array, treat it as the
// fresh list; otherwise fall back to a manual refetch. Confirm with
// backend whether this is intentional.
export const deleteOrder = async (orderId: number): Promise<Order[] | null> => {
  const { data } = await ApiClient.delete<ApiResponse<Order[] | null>>(
    `${BASE}/${orderId}`
  );
  return data.data;
};


export const getOrderById = async (orderId: number): Promise<Order> => {
  const { data } = await ApiClient.get<ApiResponse<Order>>(`${BASE}/${orderId}`);
  return data.data;
};

// Admin's actual decision after reviewing the cancelled order.
// approve → processes refund, sets PaymentStatus to REFUNDED.
// deny → leaves PaymentStatus as SUCCESS but records that a refund
// was reviewed and declined, with a reason for audit purposes.
export interface RefundDecisionPayload {
  approve: boolean;
  reason?: string;
}

// ASSUMPTION: no refund-decision endpoint documented yet — dummy
// backend method provided below. Confirm real path with backend.
export const decideOrderRefund = async (
  orderId: number,
  payload: RefundDecisionPayload
): Promise<Order | null> => {
  const { data } = await ApiClient.post<ApiResponse<Order | null>>(
    `${BASE}/${orderId}/refund-decision`,
    payload
  );
  return data.data;
};



export const createOrder = async (payload:CreateOrderPayload): Promise<Order> =>{
  const { data } = await ApiClient.post<ApiResponse<Order>>(
    `${BASE}`,
    payload
  );
  return data.data;
}

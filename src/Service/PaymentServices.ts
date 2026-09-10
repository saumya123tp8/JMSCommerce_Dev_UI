import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type {
  PaymentInitiationResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../types/payment";

const BASE = "/payments";

export const initiatePayment = async (
  orderId: number
): Promise<PaymentInitiationResponse> => {
  const { data } = await ApiClient.post<ApiResponse<PaymentInitiationResponse>>(
    `${BASE}/orders/${orderId}/initiate`
  );
  return data.data;
};

export const verifyPayment = async (
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> => {
  const { data } = await ApiClient.post<ApiResponse<VerifyPaymentResponse>>(
    `${BASE}/verify`,
    payload
  );
  return data.data;
};

export const retryPayment = async (
  orderId: number
): Promise<PaymentInitiationResponse> => {
  const { data } = await ApiClient.post<ApiResponse<PaymentInitiationResponse>>(
    `${BASE}/orders/${orderId}/retry`
  );
  return data.data;
};

export const cancelPaymentAttempt = async (
  orderId: number,
  attemptId: number
): Promise<null> => {
  const { data } = await ApiClient.patch<ApiResponse<null>>(
    `${BASE}/orders/${orderId}/attempts/${attemptId}/cancel`
  );
  return data.data;
};
export type PaymentStatus =
  | "PENDING"
  | "INITIATING"
  | "INITIATED"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export interface PaymentInitiationResponse {
  orderId: number;
  paymentId: number;
  paymentAttemptId: number;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId: number;
  paymentId: number;
  paymentAttemptId: number;
  paymentStatus: PaymentStatus;
}
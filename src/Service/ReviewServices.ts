import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Review, CreateReviewPayload, UpdateReviewPayload } from "../types/review";

export const getProductReviews = async (productId: number): Promise<Review[]> => {
  const { data } = await ApiClient.get<ApiResponse<Review[]>>(
    `/products/${productId}/reviews`
  );
  return data.data;
};

export const createReview = async (
  orderId: number,
  orderItemId: number,
  payload: CreateReviewPayload
): Promise<Review> => {
  const { data } = await ApiClient.post<ApiResponse<Review>>(
    `/orders/${orderId}/items/${orderItemId}/review`,
    payload
  );
  return data.data;
};

export const updateReview = async (
  orderId: number,
  orderProductId: number,
  payload: UpdateReviewPayload
): Promise<Review> => {
  const { data } = await ApiClient.put<ApiResponse<Review>>(
    `/orders/${orderId}/items/${orderProductId}/review`,
    payload
  );
  return data.data;
};

export const deleteReview = async (
  orderId: number,
  orderProductId: number
): Promise<null> => {
  const { data } = await ApiClient.delete<ApiResponse<null>>(
    `/orders/${orderId}/items/${orderProductId}/review`
  );
  return data.data;
};
import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Cart, AddCartItemPayload, UpdateCartItemPayload } from "../types/cart";

const BASE = "/cart";

export const getCart = async (): Promise<Cart> => {
  const { data } = await ApiClient.get<ApiResponse<Cart>>(BASE);
  return data.data;
};

export const addCartItem = async (payload: AddCartItemPayload): Promise<Cart> => {
  const { data } = await ApiClient.post<ApiResponse<Cart>>(`${BASE}/items`, payload);
  return data.data;
};

export const updateCartItem = async (
  cartItemId: string,
  payload: UpdateCartItemPayload
): Promise<Cart> => {
  const { data } = await ApiClient.put<ApiResponse<Cart>>(
    `${BASE}/items/${cartItemId}`,
    payload
  );
  return data.data;
};

export const removeCartItem = async (cartItemId: string): Promise<Cart> => {
  const { data } = await ApiClient.delete<ApiResponse<Cart>>(
    `${BASE}/items/${cartItemId}`
  );
  return data.data;
};

export const clearCart = async (): Promise<null> => {
  const { data } = await ApiClient.delete<ApiResponse<null>>(BASE);
  return data.data;
};
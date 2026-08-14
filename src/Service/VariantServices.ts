import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type {
  Variant,
  CreateVariantPayload,
  UpdateVariantPayload,
} from "../types/variant";

const base = (productId: number) => `/products/${productId}/variants`;

export const getAllVariants = async (
  productId: number
): Promise<Variant[]> => {
  const { data } = await ApiClient.get<ApiResponse<Variant[]>>(
    base(productId)
  );
  return data.data;
};

export const getVariant = async (
  productId: number,
  variantId: number
): Promise<Variant> => {
  const { data } = await ApiClient.get<ApiResponse<Variant>>(
    `${base(productId)}/${variantId}`
  );
  return data.data;
};

export const createVariant = async (
  productId: number,
  payload: CreateVariantPayload
): Promise<Variant> => {
  const { data } = await ApiClient.post<ApiResponse<Variant>>(
    base(productId),
    payload
  );
  return data.data;
};

export const updateVariant = async (
  productId: number,
  variantId: number,
  payload: UpdateVariantPayload
): Promise<Variant> => {
  const { data } = await ApiClient.put<ApiResponse<Variant>>(
    `${base(productId)}/${variantId}`,
    payload
  );
  return data.data;
};

export const deleteVariant = async (
  productId: number,
  variantId: number
): Promise<null> => {
  const { data } = await ApiClient.delete<ApiResponse<null>>(
    `${base(productId)}/${variantId}`
  );
  return data.data;
};
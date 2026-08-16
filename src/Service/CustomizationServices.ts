import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type {
  CustomizationResponse,
  CustomizationRequest,
} from "../types/customization";

const base = (productId: number) =>
  `products/${productId}/customizations`;

// NOTE (per API doc): the product must be ACTIVE and must not
// already have customization groups — the backend will reject this
// otherwise. Surface that error directly rather than guessing why
// it failed.
export const createCustomizations = async (
  productId: number,
  payload: CustomizationRequest
): Promise<CustomizationResponse> => {
  const { data } = await ApiClient.post<ApiResponse<CustomizationResponse>>(
    base(productId),
    payload
  );
  return data.data;
};

export const getCustomizations = async (
  productId: number
): Promise<CustomizationResponse> => {
  const { data } = await ApiClient.get<ApiResponse<CustomizationResponse>>(
    base(productId)
  );
  return data.data;
};

// Full replacement per API doc — sends the complete desired group
// set, not a partial diff.
export const updateCustomizations = async (
  productId: number,
  payload: CustomizationRequest
): Promise<CustomizationResponse> => {
  const { data } = await ApiClient.put<ApiResponse<CustomizationResponse>>(
    base(productId),
    payload
  );
  return data.data;
};
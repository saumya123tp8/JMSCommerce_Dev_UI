import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Brand } from "../types/brand";

// ASSUMPTION: endpoint path unconfirmed — adjust once backend
// documents the real Brand API.
const BASE = "/brand";

export const getAllBrands = async (): Promise<Brand[]> => {
  const { data } = await ApiClient.get<ApiResponse<Brand[]>>(BASE);
  return data.data;
};
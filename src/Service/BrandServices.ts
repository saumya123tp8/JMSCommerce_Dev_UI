import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Brand, BrandPayload } from "../types/brand";

const BASE = "/brand"; // singular, not /brands — confirmed per doc

export const getAllBrands = async (): Promise<Brand[]> => {
  const { data } = await ApiClient.get<ApiResponse<Brand[]>>(BASE);
  return data.data;
};

export const getBrandById = async (id: number): Promise<Brand> => {
  const { data } = await ApiClient.get<ApiResponse<Brand>>(`${BASE}/${id}`);
  return data.data;
};

export const createBrand = async (payload: BrandPayload): Promise<Brand> => {
  const { data } = await ApiClient.post<ApiResponse<Brand>>(BASE, payload);
  return data.data;
};

export const updateBrand = async (
  id: number,
  payload: BrandPayload
): Promise<Brand> => {
  const { data } = await ApiClient.put<ApiResponse<Brand>>(`${BASE}/${id}`, payload);
  return data.data;
};

export const deleteBrand = async (id: number): Promise<null> => {
  const { data } = await ApiClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return data.data;
};
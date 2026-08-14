import apiClient from "@/Config/ApiCleint";
import type {
  Specification,
  CreateSpecificationRequest,
  UpdateSpecificationRequest,
} from "../types/specification";
import type { ApiResponse } from "../types/apiResponses";

const BASE = "/specifications";

export const getAllSpecifications = async (): Promise<Specification[]> => {
  const { data } = await apiClient.get<ApiResponse<Specification[]>>(BASE);
  return data.data;
};

export const getSpecificationById = async (
  id: number
): Promise<Specification> => {
  const { data } = await apiClient.get<ApiResponse<Specification>>(
    `${BASE}/${id}`
  );
  return data.data;
};

export const createSpecification = async (
  payload: CreateSpecificationRequest
): Promise<Specification> => {
  const { data } = await apiClient.post<ApiResponse<Specification>>(
    BASE,
    payload
  );
  return data.data;
};

export const updateSpecification = async (
  id: number,
  payload: UpdateSpecificationRequest
): Promise<Specification> => {
  const { data } = await apiClient.put<ApiResponse<Specification>>(
    `${BASE}/${id}`,
    payload
  );
  return data.data;
};

// KNOWN BACKEND BUG (per your API doc): the controller currently
// verifies the specification exists and returns success, but never
// actually calls the delete — so this will report success without
// removing anything server-side until that's fixed. Wired here so
// it "just works" once patched; the list page shows a warning toast
// rather than assuming success means the row is gone.
export const deleteSpecification = async (id: number): Promise<null> => {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `${BASE}/${id}`
  );
  return data.data;
};
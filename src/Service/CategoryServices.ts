import apiClient from "@/Config/ApiCleint";
import type { ApiResponse } from "@/types/auth";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/types/category";

const CATEGORIES_BASE = "/categories";

export const getAllCategories = async (): Promise<Category[]> => {
  const response =
    await apiClient.get<ApiResponse<Category[]>>(CATEGORIES_BASE);
  return response.data.data;
};

export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await apiClient.get<ApiResponse<Category>>(
    `${CATEGORIES_BASE}/${id}`,
  );
  return response.data.data;
};

export const createCategory = async (
  payload: CreateCategoryRequest,
): Promise<Category> => {
  const response = await apiClient.post<ApiResponse<Category>>(
    CATEGORIES_BASE,
    payload,
  );
  return response.data.data;
};

export const updateCategory = async (
  id: number,
  payload: UpdateCategoryRequest,
): Promise<Category> => {
  const response = await apiClient.put<ApiResponse<Category>>(
    `${CATEGORIES_BASE}/${id}`,
    payload,
  );
  return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${CATEGORIES_BASE}/${id}`);
};

import type { ApiResponse } from "./auth";

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus;
  parentId: number | null;
  level: number;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  parentId?: number | null;
  status?: CategoryStatus;
}

export type CategoryListResponse = ApiResponse<Category[]>;
export type CategoryResponse = ApiResponse<Category>;

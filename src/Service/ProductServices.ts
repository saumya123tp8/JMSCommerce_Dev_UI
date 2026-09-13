import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type {
  Product,
  ProductDetails,
  CreateProductPayload,
  UpdateProductPayload,
  ProductSpecificationValue,
  ProductSearchResponse,
  
} from "../types/product";

const BASE = "/products";

export const getAllProducts = async (): Promise<Product[]> => {
  const { data } = await ApiClient.get<ApiResponse<Product[]>>(BASE);
  return data.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await ApiClient.get<ApiResponse<Product>>(`${BASE}/${id}`);
  return data.data;
};

export const getProductDetails = async (
  id: number
): Promise<ProductDetails> => {
  const { data } = await ApiClient.get<ApiResponse<ProductDetails>>(
    `${BASE}/${id}/details`
  );
  return data.data;
};

export const createProduct = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const { data } = await ApiClient.post<ApiResponse<Product>>(BASE, payload);
  return data.data;
};

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload
): Promise<Product> => {
  const { data } = await ApiClient.put<ApiResponse<Product>>(
    `${BASE}/${id}`,
    payload
  );
  return data.data;
};

// NOTE (per API doc): the live endpoint currently expects a query
// param literally named `categoryName`, even though the value it
// wants is a numeric category ID (documented backend bug). Using
// the real param name here so this works today — switch to
// `categoryId` once the backend fix from the doc's TODO list ships.
export const getProductsByCategory = async (
  categoryId: number
): Promise<ProductDetails[]> => {
  const { data } = await ApiClient.get<ApiResponse<ProductDetails[]>>(
    `${BASE}/search`,
    { params: { categoryName: categoryId } }
  );
  return data.data;
};

export interface ProductSearchParams {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sale?: boolean;
  sort?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating" | "name";
  page?: number;
  size?: number;
}

export const searchProducts = async (
  params: ProductSearchParams
): Promise<ProductSearchResponse> => {
  const { data } = await ApiClient.get<
    ApiResponse<ProductSearchResponse>
  >(`${BASE}/search/filter`, {
    params,
  });

  return data.data;
};

export const getProductSpecifications = async (
  productId: number
): Promise<ProductSpecificationValue[]> => {
  const { data } = await ApiClient.get<ApiResponse<ProductSpecificationValue[]>>(
    `${BASE}/${productId}/specifications`
  );
  return data.data;
};
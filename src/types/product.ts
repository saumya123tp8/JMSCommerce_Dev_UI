// TODO (per API doc): exact enum values unconfirmed with backend.
// Values below are what's visible in the doc's examples, plus
// reasonable guesses for the rest — swap once confirmed.
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";
export type CurrencyType = "INR" | "USD" | "EUR";
export type InventoryType = "FINITE" | "INFINITE";

export interface Product {
  id: number;
  name: string;
  mrp: number;
  primaryImage: string;
  rating: number;
  brandName: string;
  currency: CurrencyType;
  sellingPrice: number;
  shortDescription: string;
  status: ProductStatus;
  inventoryType: InventoryType;
}

export interface ProductDetails extends Product {
  category: { id: number; name: string; slug: string };
  brand: { id: number; name: string };
  description: string;
  ratingCount: number;
  reviewCount: number;
}

export interface ProductSpecificationInput {
  specificationId: number;
  value: string;
}

export interface CreateProductPayload {
  name: string;
  currency: CurrencyType;
  primaryImage: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  brandId: number;
  inventoryType: InventoryType;
  specifications: ProductSpecificationInput[];
}

export type UpdateProductPayload = CreateProductPayload;

export interface ProductSpecificationValue {
  specificationId: number;
  specificationName: string;
  value: string;
}
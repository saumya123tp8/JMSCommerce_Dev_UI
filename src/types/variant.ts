export interface VariantAttributeInput {
    specificationDefinitionId: number;
    value: string;
  }
  
  export interface VariantAttribute {
    specificationDefinitionId: number;
    specificationName: string;
    value: string;
  }
  
  export interface Variant {
    id: number;
    displayName: string;
    mrp: number;
    sellingPrice: number;
    stock: number;
    sku: string;
    barcode: string;
    active: boolean;
    attributes: VariantAttribute[];
  }
  
  export interface CreateVariantPayload {
    mrp: number;
    sellingPrice: number;
    stock: number;
    sku: string;
    barcode: string;
    attributes: VariantAttributeInput[];
  }
  
  export type UpdateVariantPayload = CreateVariantPayload;
export interface CartItem {
    id: string;
    variantId: number;
    productId: number;
    productName: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
    customizationPrice: number;
    totalPrice: number;
    selectedCustomizations: string[];
    image: string;
    availableStock: number;
    available: boolean;
    sku: string;
  }
  
  export interface Cart {
    items: CartItem[];
    subtotal: number;
    totalQuantity: number;
    discount: number;
    tax: number;
    deliveryCharge: number;
    grandTotal: number;
  }
  
  export interface AddCartItemPayload {
    variantId: number;
    quantity: number;
    customizationOptionIds?: number[];
  }
  
  export type UpdateCartItemPayload = Omit<AddCartItemPayload, "variantId">;
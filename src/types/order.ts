export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface OrderItemCustomization {
  customizationOptionId: number;
  name: string;
  priceAdjustment: number;
}

export interface OrderItem {
  orderItemId:number;
  productId: number;
  variantId: number;
  productName: string;
  variantName: string;
  sku: string;
  quantity: number;
  mrp: number;
  sellingPrice: number;
  customizationPrice: number;
  subTotal: number;
  productImage: string;
  customizations: OrderItemCustomization[];
}

// types/order.ts — add these fields to the existing Order interface
export interface OrderDeliveryAddress {
  receiverName: string;
  receiverPhone: string;
  houseNumber: string;
  apartment: string | null;
  street: string;
  landmark: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: "HOME" | "OFFICE" | "OTHER"; // per Address doc's unconfirmed enum
  deliveryInstructions: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryAddress: OrderDeliveryAddress;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharge: number;
  grandTotal: number;
  orderItems: OrderItem[];
}

export type PaymentMethod = "RAZORPAY" | "COD";

export interface CreateOrderPayload {
  addressId: number;
  paymentMethod: PaymentMethod;
}
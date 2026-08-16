// types/address.ts
export type AddressType = "HOME" | "WORK" | "OTHER"; // unconfirmed enum

export interface Address {
  id: number;
  receiverName: string;
  receiverPhone: string;
  countryCode: string | null;
  houseNumber: string;
  apartment: string | null;
  street: string;
  landmark: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  type: AddressType;
  defaultAddress: boolean;
  deliveryInstructions: string | null;
}

export type AddressPayload = Omit<Address, "id">;
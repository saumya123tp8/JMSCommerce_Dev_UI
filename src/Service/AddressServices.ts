// Service/AddressServices.ts
import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { Address, AddressPayload } from "../types/address";

const BASE = "/addresses";

export const getAllAddresses = async (): Promise<Address[]> => {
  const { data } = await ApiClient.get<ApiResponse<Address[]>>(BASE);
  return data.data;
};

export const getAddressById = async (id: number): Promise<Address> => {
  const { data } = await ApiClient.get<ApiResponse<Address>>(`${BASE}/${id}`);
  return data.data;
};

export const createAddress = async (payload: AddressPayload): Promise<Address> => {
  const { data } = await ApiClient.post<ApiResponse<Address>>(BASE, payload);
  return data.data;
};

export const updateAddress = async (
  id: number,
  payload: AddressPayload
): Promise<Address> => {
  const { data } = await ApiClient.put<ApiResponse<Address>>(`${BASE}/${id}`, payload);
  return data.data;
};

export const deleteAddress = async (id: number): Promise<null> => {
  const { data } = await ApiClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return data.data;
};

export const setDefaultAddress = async (id: number): Promise<Address> => {
  const { data } = await ApiClient.patch<ApiResponse<Address>>(
    `${BASE}/${id}/default`
  );
  return data.data;
};
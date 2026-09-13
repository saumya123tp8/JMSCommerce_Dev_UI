import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { UserProfile, UpdateProfilePayload, VerificationType } from "../types/profile";

const BASE = "/users/me";

export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await ApiClient.get<ApiResponse<UserProfile>>(BASE);
  return data.data;
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const { data } = await ApiClient.put<ApiResponse<UserProfile>>(BASE, payload);
  return data.data;
};

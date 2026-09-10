import ApiClient from "../Config/ApiCleint";
import type { ApiResponse } from "../types/apiResponses";
import type { UserProfile, UpdateProfilePayload, VerificationType } from "../types/profile";

const BASE = "/api/v1/users/me";

export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await ApiClient.get<ApiResponse<UserProfile>>(BASE);
  return data.data;
};

export const updateMyProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
  const { data } = await ApiClient.put<ApiResponse<UserProfile>>(BASE, payload);
  return data.data;
};

export const requestEmailOtp = async (): Promise<void> => {
  await ApiClient.post(`${BASE}/email-verification`);
};

export const verifyEmailOtp = async (otp: string): Promise<{ emailVerified: boolean }> => {
  const { data } = await ApiClient.post<ApiResponse<{ emailVerified: boolean }>>(
    `${BASE}/email-verification/verify`,
    { otp }
  );
  return data.data;
};

export const requestPhoneOtp = async (): Promise<void> => {
  await ApiClient.post(`${BASE}/phone-verification`);
};

export const verifyPhoneOtp = async (otp: string): Promise<{ phoneVerified: boolean }> => {
  const { data } = await ApiClient.post<ApiResponse<{ phoneVerified: boolean }>>(
    `${BASE}/phone-verification/verify`,
    { otp }
  );
  return data.data;
};

export const resendOtp = async (type: VerificationType): Promise<void> => {
  await ApiClient.post(`${BASE}/verification/resend`, { type });
};
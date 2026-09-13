
import type {  RegisterFormData, LoginFormData, LoginResponse, ApiResponse } from '../types/auth';
import apiClient from '../Config/ApiCleint';
import apiRefreshClient from '@/Config/ApiRefreshClient';

export const registerUser = async (
  registeredUserData: RegisterFormData
): Promise<ApiResponse<null>> => {

  const response = await apiClient.post<ApiResponse<null>>(
    "/auth/register",
    registeredUserData
  );

  return response.data;
};

export const loginUser = async (loginUserData: LoginFormData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(`/auth/login`, loginUserData);
    console.log('Login response:', response);
    return response.data.data;
  }catch (error : any) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

export const getUserByEmail = async (email: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<LoginResponse>>(`/users/email/${email}`);
    console.log('User response:', response);
    return response.data.data;
  }catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}


export const refreshToken = async () =>{
  try{
     const response = await apiRefreshClient.post<LoginResponse>('/auth/refresh');
    // const response = await axios.post<ApiResponse<LoginResponse>>('http://localhost:8081/api/v1/auth/refresh',{},
    // {
    //     withCredentials: true,
    // });
     return response?.data;
  }catch(error){
    console.log("error in renew token "+error);
    throw error;
  }
}

export const verifyEmail = async (token: string): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.get<ApiResponse<null>>(
      "/auth/verify-email",
      {
        params: {
          token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};


export const resendVerificationEmail = async (token: string): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.get<ApiResponse<null>>(
      "/auth/verify-email",
      {
        params: {
          token,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};


export const sendVerificationEmail = async (): Promise<ApiResponse<null>> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(
      "/mail/reverify-email"
    );

    return response.data;
  } catch (error) {
    console.error("Error in sending verification email:", error);
    throw error;
  }
};

export const forgotPassword = async (
  email: string
): Promise<ApiResponse<null>> => {

  try {

    const response =
      await apiClient.post<ApiResponse<null>>(
        "/auth/forgot-password",
        {
          email,
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Error requesting password reset:",
      error
    );

    throw error;
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<null>> => {

  try {

    const response =
      await apiClient.post<ApiResponse<null>>(
        "/auth/reset-password",
        {
          token,
          newPassword,
        }
      );

    return response.data;

  } catch (error) {

    console.error(
      "Error resetting password:",
      error
    );

    throw error;
  }
};
import { createAsyncThunk } from "@reduxjs/toolkit";

import { registerUser } from "../../../Service/AuthServices";

import type {
  RegisterFormData,
  ApiResponse,
} from "../../../types/auth";

export const registerThunk = createAsyncThunk<
  ApiResponse<null>,          // Success Response Type
  RegisterFormData,           // Request Body Type
  {
    rejectValue: string;
  }
>(
  "auth/register",

  async (credentials, thunkAPI) => {
    try {
      const response = await registerUser(credentials);

      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ??
          "Registration Failed"
      );
    }
  }
);
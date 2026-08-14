import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../../Service/CategoryServices";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../types/category";
import type { ApiErrorResponse } from "../../types/apiResponses";
import { ApiResponse } from "@/types/auth";

const extractErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return (
    axiosError.response?.data?.error ??
    axiosError.message ??
    "Something went wrong"
  );
};

export const fetchAllCategories = createAsyncThunk

("category/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await getAllCategories();
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCategoryById = createAsyncThunk
  
("category/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await getCategoryById(id);
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const addCategory = createAsyncThunk<
    Category,
    CreateCategoryRequest,
    { rejectValue: string }
>(
    "category/create",
    async (payload, { rejectWithValue }) => {
        try {
            return await createCategory(payload);
        } catch (error) {
            return rejectWithValue(
                extractErrorMessage(error)
            );
        }
    }
);

export const editCategory = createAsyncThunk<
    Category,
    { id: number, payload: UpdateCategoryRequest },
    { rejectValue: string }
>(
    "category/update",
    async ({ id, payload }: { id: number, payload: UpdateCategoryRequest }, { rejectWithValue }) => {
        try {
            return await updateCategory(id, payload);
        } catch (error) {
            return rejectWithValue(
                extractErrorMessage(error)
            );
        }
    }
);
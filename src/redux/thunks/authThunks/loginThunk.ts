import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../../Service/AuthServices";
import type {  LoginFormData } from "../../../types/auth";
export const loginThunk =
createAsyncThunk(

    "auth/login",
    //simply name of the action required to be dispatched 
    // if not provided it will be generated automatically by the createAsyncThunk function

    async (credentials : LoginFormData, { rejectWithValue }) => {

        // const response =
        //     await loginUser(credentials);
        // return response;
         try {
            return await loginUser(credentials);
        } catch (err : any) {
            return rejectWithValue(err);
            throw err;
        }

    }

);

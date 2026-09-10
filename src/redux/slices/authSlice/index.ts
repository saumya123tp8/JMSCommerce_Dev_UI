import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {AuthState, renewAuthStore} from '../../../types/auth'
import { loginThunk } from '../../thunks/authThunks/loginThunk';

const initialState: AuthState = {
     isAuthenticated: false,
     user: null,
     accessToken: null,
     loading: false,
     error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
   reducers:{

        logout(state){

            state.user=null;
            state.accessToken=null;
            state.isAuthenticated=false;

        },

       renewAuthStoreAction(state, action: PayloadAction<renewAuthStore>) {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.user = action.payload.user;
       }

    },

    extraReducers: (builder) => {

    builder.addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
    });

    builder.addCase(loginThunk.fulfilled, (state, action) => {

        state.loading = false;

        state.user = action.payload.userDto;

        state.isAuthenticated = true;

        state.accessToken = action.payload.accessToken;

    });

    builder.addCase(loginThunk.rejected, (state, action) => {

        state.loading = false;

        state.error =   action?.error?.message||"Login Failed";
        console.error("Login Failed", action.error.message);

    });

}
});

export const {logout, renewAuthStoreAction} = authSlice.actions;
export default authSlice.reducer;
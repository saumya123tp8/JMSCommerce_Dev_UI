import {configureStore} from '@reduxjs/toolkit';
import counterSlice from './slices/counterSlice';
import authReducer from './slices/authSlice';
import { setupInterceptors, setupResponseInterceptors } from '@/Config/ApiCleint';
const store = configureStore({
    reducer: {
        counter: counterSlice,
        auth:authReducer
    }
})

setupInterceptors(store);
setupResponseInterceptors(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export type AppStore = typeof store;


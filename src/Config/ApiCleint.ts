import { renewAuthStoreAction } from "@/redux/slices/authSlice";
import type { AppStore } from "@/redux/store";
import { refreshToken } from "@/Service/AuthServices";
import type { renewAuthStore } from "@/types/auth";
import axios from "axios";

// const dispatch = useAppDispatch(); // hooks can be called inside react componenet and already we have access to store in the methods

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
  timeout: 10000, // Set a timeout for requests (in milliseconds)
});
//we need to add an interceptor to handle the token and refresh it if needed
//becuase even If the session is not expired after login, we are not able to access the
//protected routes because the token is not being sent in the request headers
//we do not send in login because the token is not available yet, but after login we need to send it in the headers
// apiClient.interceptors.request.use(
//   (config) => {
//     const accessToken = store.getState().auth.accessToken; // Get the access token from the Redux store
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   }
// );
// here we feel difficulty of getting acess token becuase of circular dependency, so we will use a different approach to get the access token from the store
//either we can use local storage for storing the access token or we can use a different approach to get the access token from the store, we will use local storage for now

// or

//call this method in store after the store is created and pass the store as an argument to this method, so that we can access the store in the interceptor and get the access token from the store, this way we can avoid circular dependency issue
// interceptor.ts
export const setupInterceptors = (store: AppStore) => {
  apiClient.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    console.log("Access token from store:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

//similiarly we can use response interceptor to handle the refresh token and get the new access token if the access token is expired,
//or we can check error to take decision
let isRefreshing = false;
let pending: any[] = [];

function queueRequest(cb: any) {
  pending.push(cb);
}

function resolvePending(newToken: String) {
  pending.forEach((cb) => cb(newToken));
  pending = [];
}

export const setupResponseInterceptors = (store: AppStore) => {
  console.log("setupResponseInterceptors method called to renew token");

  apiClient.interceptors.response.use(
    (response) => {
      // If the response is successful, just return it
      console.log("setupResponseInterceptors method called to success");
      return response;
    },

    async (error) => {
      console.log("setupResponseInterceptors method called to renew token");
      console.error("API Error in response interceptor:", error);
      const is$01Status401 = error.response && error.response.status === 401;
      const message = error.response?.data?.message || error.message;
      const originalRequest = error.config;

      if (
        !is$01Status401 ||
        originalRequest._retry ||
        message === "Token Expired"
      ) {
        return Promise.reject(error.response?.data);
      }

      originalRequest._retry = true; // ( so that we can stop and reject all upcoming same req. )
      // but what about diff req. having same expire token
      // we have is refreshing lock which will queue all the upcoming request and serve those after getting new access token

      try {
        //we need to create and push a call back method which will resolve at the time of resolve method call
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queueRequest((newToken: String) => {
              if (!newToken) return reject;
              originalRequest.headers.authorization = `Bearer ${newToken}`;
              resolve(apiClient(originalRequest));
            });
          });
        }

        // start refresh

        isRefreshing = true;

        try {
          const loginResponse = await refreshToken();
          const newAccessToken = loginResponse?.accessToken;
          const renewAuthStoreData: renewAuthStore = {
            accessToken: loginResponse?.accessToken,
            user: loginResponse?.userDto,
          };
          //  store.getState().auth.accessToken = newAccessToken;// also updated in redux store
          store.dispatch(renewAuthStoreAction(renewAuthStoreData)); //correct way to update store because store is immutable/read only
          resolvePending(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (error) {
          throw error;
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};

export default apiClient;

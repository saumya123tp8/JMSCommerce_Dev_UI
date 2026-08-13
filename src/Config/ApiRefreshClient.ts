import axios from "axios";

// const dispatch = useAppDispatch(); // hooks can be called inside react componenet and already we have access to store in the methods


const apiRefreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
  timeout: 10000, // Set a timeout for requests (in milliseconds)
});

export default apiRefreshClient;

import { useLoadingStore } from "@/store/loading/loadingStore";

import { useUserStore } from "@/features/auth/store/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./config";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
REQUEST INTERCEPTOR
*/

axiosClient.interceptors.request.use(
  (config) => {
    useLoadingStore.getState().setLoading(true);

    const token = useUserStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  },
);

/*
RESPONSE INTERCEPTOR
*/

axiosClient.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error) => {
    useLoadingStore.getState().setLoading(false);

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("token");

      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

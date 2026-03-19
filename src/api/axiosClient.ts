import { useUserStore } from "@/features/auth/store/userStore";
import { useLoadingStore } from "@/store/loading/loadingStore";
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
========================
REQUEST INTERCEPTOR
========================
*/

axiosClient.interceptors.request.use(
  async (config) => {
    useLoadingStore.getState().setLoading(true);

    // 🔥 FIX: SIEMPRE leer desde AsyncStorage
    const token = await AsyncStorage.getItem("token");

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
========================
RESPONSE INTERCEPTOR
========================
*/

axiosClient.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false);
    return response;
  },
  async (error) => {
    useLoadingStore.getState().setLoading(false);

    const { isRestoring } = useUserStore.getState();

    // 🔥 manejar 401 correctamente
    if (error.response?.status === 401 && !isRestoring) {
      console.log("❌ Token inválido → logout");

      // limpiar storage completo
      await AsyncStorage.multiRemove(["token", "user"]);

      // limpiar estado global
      useUserStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

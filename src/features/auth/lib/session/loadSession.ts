import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../../store/userStore";

export const loadSession = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) return;

  const decoded: any = jwtDecode(token);

  const user = {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
  };

  useUserStore.getState().setSession(user, token);
};

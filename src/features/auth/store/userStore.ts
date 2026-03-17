import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  /**
   * Guarda la sesión en memoria (Zustand) y en disco (AsyncStorage).
   * Se llama después de login o register exitoso.
   */
  setSession: (user: User, token: string) => Promise<void>;

  /**
   * Limpia la sesión de memoria y disco.
   */
  logout: () => Promise<void>;

  /**
   * Restaura la sesión al arrancar la app.
   * Llamar en el _layout.tsx una sola vez.
   */
  restoreSession: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setSession: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    const token = await AsyncStorage.getItem("token");
    const userRaw = await AsyncStorage.getItem("user");
    if (!token || !userRaw) return;
    try {
      const user = JSON.parse(userRaw) as User;
      set({ user, token, isAuthenticated: true });
    } catch {
      // datos corruptos — limpia
      await AsyncStorage.multiRemove(["token", "user"]);
    }
  },
}));

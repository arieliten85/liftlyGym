import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { User } from "@/types/auth/user";

type UserStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isRestoring: boolean; // true mientras lee AsyncStorage al arrancar

  setSession: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isRestoring: true, // arranca en true hasta que restoreSession termine

  setSession: async (user, token) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    set({ user: null, token: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userRaw = await AsyncStorage.getItem("user");
      if (token && userRaw) {
        const user = JSON.parse(userRaw) as User;
        set({ user, token, isAuthenticated: true });
      }
    } catch {
      await AsyncStorage.multiRemove(["token", "user"]);
    } finally {
      set({ isRestoring: false }); // siempre termina la restauración
    }
  },
}));

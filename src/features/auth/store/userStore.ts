import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  token: string | null;

  setSession: (user: User, token: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,

  setSession: (user, token) =>
    set({
      user,
      token,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));

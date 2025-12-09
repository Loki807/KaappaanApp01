import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types/user.types";

interface AuthState {
  user: User | null;
  token: string | null;

  setUser: (user: User, token: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: async (user: User, token: string) => {
    await SecureStore.setItemAsync("token", token);
    set({ user, token });
  },

  loadToken: async () => {
    const token = await SecureStore.getItemAsync("token");
    if (token) set({ token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("token");
    set({ user: null, token: null });
  },
}));

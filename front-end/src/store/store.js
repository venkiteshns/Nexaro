import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            clearUser: () => set({ user: null, token: null, role: null }),
        }),
        {
            name: "auth",
            // storage: createJSONStorage(() => localStorage) is default, but we can leave it as is if needed
        }
    )
);

export default useAuthStore;
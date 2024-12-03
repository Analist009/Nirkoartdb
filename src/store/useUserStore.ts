import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  credits: number;
  imagesGenerated: number;
  setUser: (user: { id: string; name: string; email: string }) => void;
  clearUser: () => void;
  decrementCredits: () => void;
  incrementImagesGenerated: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      credits: 10,
      imagesGenerated: 0,
      setUser: (user) => set({ ...user }),
      clearUser: () => set({ id: null, name: null, email: null }),
      decrementCredits: () => set((state) => ({ credits: Math.max(0, state.credits - 1) })),
      incrementImagesGenerated: () => set((state) => ({ imagesGenerated: state.imagesGenerated + 1 })),
    }),
    {
      name: 'user-storage',
    }
  )
);
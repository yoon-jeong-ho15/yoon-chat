import { create } from "zustand";

type HeaderStore = {
  text: string | null;
  setText: (text: string | null) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
  text: null,
  setText: (text) => set({ text }),
}));

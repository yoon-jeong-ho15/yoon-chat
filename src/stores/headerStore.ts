import { create } from "zustand";

const DEFAULT_TEXTS = [
  "안녕하세요",
  "Hello",
  "こんにちは",
  "Hola",
  "Bonjour",
  "Hallo",
];
const INTERVAL = 10000;

type HeaderStore = {
  text: string | null;
  currentDefaultIndex: number;
  displayText: string;
  key: number;
  setText: (text: string | null) => void;
};

let textTimer: ReturnType<typeof setTimeout> | null = null;
let indexCheckInterval: ReturnType<typeof setInterval> | null = null;

export const useHeaderStore = create<HeaderStore>((set, get) => {
  // Initialize default text rotation
  const startDefaultRotation = () => {
    if (indexCheckInterval) clearInterval(indexCheckInterval);

    indexCheckInterval = setInterval(() => {
      const newIndex = Math.floor(Date.now() / INTERVAL) % DEFAULT_TEXTS.length;
      const currentState = get();

      if (newIndex !== currentState.currentDefaultIndex && !currentState.text) {
        set({
          currentDefaultIndex: newIndex,
          displayText: DEFAULT_TEXTS[newIndex],
          key: currentState.key + 1,
        });
      }
    }, 1000);
  };

  startDefaultRotation();

  return {
    text: null,
    currentDefaultIndex: Math.floor(Date.now() / INTERVAL) % DEFAULT_TEXTS.length,
    displayText: DEFAULT_TEXTS[Math.floor(Date.now() / INTERVAL) % DEFAULT_TEXTS.length],
    key: 0,

    setText: (text) => {
      const currentState = get();

      if (textTimer) clearTimeout(textTimer);

      if (text) {
        set({
          text,
          displayText: text,
          key: currentState.key + 1,
        });

        textTimer = setTimeout(() => {
          const state = get();
          set({
            text: null,
            displayText: DEFAULT_TEXTS[state.currentDefaultIndex],
            key: state.key + 1,
          });
        }, 3000);
      } else {
        set({
          text: null,
          displayText: DEFAULT_TEXTS[currentState.currentDefaultIndex],
          key: currentState.key + 1,
        });
      }
    },
  };
});

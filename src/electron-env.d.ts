import type { AyeohBridge } from '../electron/preload';

declare global {
  interface Window {
    ayeoh?: AyeohBridge;
  }
}

export {};

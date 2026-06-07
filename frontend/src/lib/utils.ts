import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// URL dell'API backend
export const API_URL = import.meta.env.VITE_API_URL || 'https://tsnlas-worker.sistemi-fdb.workers.dev';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffle<T>(array: T[]): T[] {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

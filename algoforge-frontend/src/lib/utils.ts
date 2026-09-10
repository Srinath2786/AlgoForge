import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function difficultyColor(difficulty: string) {
  switch (difficulty?.toUpperCase()) {
    case "EASY":
      return "text-cyan border-cyan/30 bg-cyan/10";
    case "HARD":
      return "text-danger border-danger/30 bg-danger/10";
    default:
      return "text-amber border-amber/30 bg-amber/10";
  }
}

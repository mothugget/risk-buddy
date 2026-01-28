import { Factor, Score } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateOverallScore(factors: Factor[], scores: Record<string, number>):number {
  if (!factors || factors.length === 0) return 0;
  let consequenceSum = 0;
  factors.forEach((factor) => {
    const score = scores[factor.id] ?? 0;
    consequenceSum += score * factor.consequence / 100;
  });
  return consequenceSum;
};
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString('pt-BR');
};
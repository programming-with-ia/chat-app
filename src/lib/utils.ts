import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function orUndefined<T>(value:T){
  return value || undefined
}

export function cn(...inputs: ClassValue[]) {
  return orUndefined(twMerge(clsx(inputs)))
}
export const IS_SERVER = typeof window === 'undefined'
export const IS_CLIENT = !IS_SERVER

export function joinStr(...args: (string | number)[]): string {
  return args.map(arg => String(arg)).join('');
}

export {clsx, twMerge}
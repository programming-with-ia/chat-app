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

export function toPusherKey(key: string) {
  return key.replace(/:/g, '__')
}

export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}

export {clsx, twMerge}
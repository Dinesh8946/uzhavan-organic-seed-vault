import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const get = (key: string) => {
  if (typeof window === "undefined") return null
  try {
    const serializedValue = localStorage.getItem(key)
    if (serializedValue === null) {
      return null
    }
    return JSON.parse(serializedValue)
  } catch (error) {
    console.error("Failed to get data from localStorage", error)
    return null
  }
}

export const set = (key: string, value: any) => {
  if (typeof window === "undefined") return
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error("Failed to set data to localStorage", error)
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

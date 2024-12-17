/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * @param obj
 * @returns
 */

/**
 *
 * @param obj1
 * @param obj2
 * @returns
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

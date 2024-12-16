/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import { clsx, type ClassValue } from 'clsx';
import { format, parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

/**
 *
 * @param obj
 * @returns
 */
export function hasBinaryData(obj: Record<string, any>): boolean {
  if (typeof obj !== 'object') {
    return false;
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (
        value instanceof Blob ||
        value instanceof File ||
        value instanceof ArrayBuffer
      ) {
        return true;
      }
      if (typeof value === 'object' && hasBinaryData(value)) {
        return true;
      }
    }
  }

  return false;
}

/**
 *
 * @param obj
 * @returns
 */
export function convertJsonToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // if (Array.isArray(value)) {
      //   for (let i = 0; i < value.length; i++) {
      //     formData.append(key, value[i]);
      //   }
      // } else {
      formData.append(key, value);
      // }
    }
  }
  return formData;
}

/**
 *
 * @param obj1
 * @param obj2
 * @returns
 */

export function objectsAreEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return false;
  }

  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  for (const key of obj1Keys) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (value1 !== value2) {
      return false;
    }
  }

  return true;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compareDateWithDuration(
  dateISOString: string | null,
  duration: number,
): string {
  if (!dateISOString) return '';
  // Convert the ISO date string to a Date object
  const inputDate = new Date(dateISOString);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = inputDate.getTime() - currentDate.getTime();

  // Calculate the difference in days
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

  if (daysDifference === duration) {
    return 'equal';
  }
  if (daysDifference < duration) {
    return 'smaller';
  }
  return 'greater';
}

export function isEmail(text: string): boolean {
  return !!text.match(
    '^(?:(?!.*?[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.+!%-]{1,64}|)|"[a-zA-Z0-9.+!% -]{1,64}")@[a-zA-Z0-9][a-zA-Z0-9.-]+(.[a-z]{2,}|.[0-9]{1,})$',
  );
}

export function shiftObjects(
  array: Record<string, any>[],
  { fromIndex, toIndex }: any,
) {
  if (
    fromIndex < 0 ||
    fromIndex >= array.length ||
    toIndex < 0 ||
    toIndex >= array.length
  ) {
    return array;
  }

  if (fromIndex === toIndex) {
    return array;
  }

  const shiftedArray = [...array];

  const [elementToShift] = shiftedArray.splice(fromIndex, 1);
  shiftedArray.splice(toIndex, 0, elementToShift);

  return shiftedArray;
}

export function splitDateAndTime(dateTimeString: string) {
  try {
    if (!dateTimeString) return ['', ''];
    const parsedDate = parseISO(dateTimeString);
    const date = format(parsedDate, 'yyyy-MM-dd');
    const time = format(parsedDate, 'h:mm:aa');
    return [date, time];
  } catch (error) {
    return ['', ''];
  }
}
interface DataEntry {
  id: string;
  auto_send?: boolean;
  layers?: string[];
}
export function processAndCombineDataForObject(
  data: Record<string, boolean | string[]>,
): DataEntry[] {
  const combinedData: Record<string, DataEntry> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('auto_send-')) {
      // Processing 'auto_send' entries
      const id = key.split('-')[1];
      if (!combinedData[id]) {
        combinedData[id] = { id };
      }
      combinedData[id].auto_send = value as boolean;
    } else {
      // Processing 'layer' entries
      const id = key;
      if (!combinedData[id]) {
        combinedData[id] = { id };
      }
      combinedData[id].layers = value as string[];
    }
  });

  return Object.values(combinedData);
}

export const convertSnakeCaseToTitleCase = (s: string) =>
  s
    .replace(/^[-_]*(.)/, (_: any, c: string) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_: any, c: string) => ` ${c.toUpperCase()}`);

export function roundToNthDecimal(value: number, num = 1) {
  if (!value) return 0;
  return value % 1 === 0 ? Number(value) : Number(value.toFixed(num));
}

export const sortedArray = (
  array: Record<string, any>[],
  key: string,
  sortType = 'asc',
) => {
  return sortType === 'desc'
    ? array.sort((a, b) => b[key] - a[key])
    : array.sort((a, b) => a[key] - b[key]);
};

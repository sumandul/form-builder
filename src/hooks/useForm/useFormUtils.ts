/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import { Schema } from 'yup';
import { IYupError } from './_lib';

/* eslint-disable import/prefer-default-export */

/**
 * The function converts an input object with nested keys in the format of "name[index].nestedKey" into
 * an output object with nested arrays and objects.
 * @param input - The input parameter is a JavaScript object with string keys and any values.
 * @returns an object with the converted input. The input is an object with string keys and any values.
 * The function converts any keys that match the pattern of "name[index].nestedKey" into nested objects
 * within an array. The function returns the converted object.
 */
export function convertObject(input: Record<string, any>): any {
  const output: Record<string, any> = {};
  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const match = key.match(/^(.*?)\[(\d+)\]\.(.*)$/);
      if (match) {
        const name = match[1];
        const index = match[2];
        const nestedKey = match[3];

        if (!output[name]) {
          output[name] = [];
        }
        if (!output[name][index]) {
          output[name][index] = {};
        }

        output[name][index][nestedKey] = input[key];
      } else {
        output[key] = input[key];
      }
    }
  }
  return output;
}

/**
 * The function `validateValueWithYupSchema` takes a Yup validation schema and a set of values, and
 * returns an object containing any validation errors.
 * @param validationSchema - The `validationSchema` parameter is a Yup schema object that defines the
 * validation rules for the `values` object. Yup is a JavaScript schema builder for value parsing and
 * validation. It allows you to define a schema with various validation rules such as required fields,
 * data types, string length, and more.
 * @param values - The `values` parameter is an object that contains the values to be validated. Each
 * key in the object represents a field name, and the corresponding value represents the value of that
 * field.
 * @returns a Promise that resolves to a Record<string, any>.
 */
export async function validateValueWithYupSchema(
  validationSchema: Schema<any>,
  values: Record<string, any>,
): Promise<Record<string, any>> {
  try {
    if (typeof values === 'object' && validationSchema)
      await validationSchema.validateSync(values, { abortEarly: false });
    return {};
  } catch (err: any) {
    const tempError: Record<string, any> = {};
    if (Array.isArray(err.inner)) {
      err.inner.forEach(({ path, message }: IYupError) => {
        tempError[path] = message;
      });
    } else {
      tempError.error = 'Error Validating form.';
    }
    const convertedErrorObject: Record<string, any> = convertObject(tempError);
    return convertedErrorObject;
  }
}

export function getControlId(formName: string, controlName: string) {
  return `-${formName}-form-field-${controlName}`;
}

/**
 * The scrollToComponent function scrolls the page smoothly to a specified component by its ID.
 * @param {string} componentId - The componentId parameter is a string that represents the id of the
 * component you want to scroll to.
 */
export function scrollToComponent(componentId: string) {
  setTimeout(() => {
    const element = document.getElementById(componentId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, 500);

  // element.focus();
  // setTimeout(() => {
  // }, 800);
  // element.focus();
}

/**
 * The IntersectionOfObjects function takes two objects as input and returns a new object that contains
 * only the properties that exist in both input objects.
 * @param obj1 - An object of type `Record<string, any>`, which means it can have any number of
 * properties of any type.
 * @param obj2 - The `obj2` parameter is a record object that contains key-value pairs.
 * @returns The function `IntersectionOfObjects` returns a new object that contains the intersection of
 * properties between `obj1` and `obj2`.
 */
export function IntersectionOfObjects(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
): Record<string, any> {
  const obj2Keys = Object.keys(obj2);
  if (!obj2Keys.length) return {};
  const intersectedObj = obj2Keys.reduce(
    (acc: Record<string, any>, item: string) => {
      if (obj1[item]) acc[item] = obj1[item];
      return acc;
    },
    {},
  );
  return intersectedObj;
}

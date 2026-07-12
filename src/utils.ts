import { err, ok, Result } from "./result";

export function assertUnreachable(x: never): never {
  throw new Error("unreachable");
}

export function arrayEq(arr1: any[], arr2: any[]): Result<boolean, string> {
  if (arr1.length !== arr2.length) {
    return ok(false);
  }

  for (let i = 0; i < arr1.length; i++) {
    const elem1 = arr1[i];
    const elem2 = arr2[i];

    const res = eq(elem1, elem2);
    if (!res.ok) {
      return res;
    }

    if (res.value === false) {
      return ok(false);
    }
  }

  return ok(true);
}

function objectEq(
  obj1: { [k: string]: any },
  obj2: { [k: string]: any },
): Result<boolean, string> {
  const keys1 = Object.keys(obj1).toSorted();
  const keys2 = Object.keys(obj2).toSorted();

  if (keys1.length !== keys2.length) {
    return ok(false);
  }

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return ok(false);
    }

    const res = eq(obj1[keys1[i]], obj2[keys2[i]]);
    if (!res.ok) {
      return res;
    }

    if (res.value === false) {
      return ok(false);
    }
  }
  return ok(true);
}

const SUPPORTED_TYPES = [
  "string",
  "number",
  "boolean",
  "undefined",
  "object",
] as const;

export type SupportedType = (typeof SUPPORTED_TYPES)[number];

export function getSupportedType<T extends SupportedType>(
  value: T,
): Result<SupportedType, string> {
  const type = typeof value;

  if (["string", "number", "boolean", "undefined", "object"].includes(type)) {
    return ok(type as SupportedType);
  }

  return err(`"${type}" not supported`);
}

export function eq(obj1: any, obj2: any): Result<boolean, string> {
  const type1Res = getSupportedType(obj1);
  const type2Res = getSupportedType(obj2);

  if (!type1Res.ok) {
    return err(`obj1: ${type1Res.error}`);
  }

  if (!type2Res.ok) {
    return err(`obj2: ${obj2.error}`);
  }

  const type1 = type1Res.value;
  const type2 = type2Res.value;
  switch (type1) {
    case "undefined":
    case "string":
    case "number":
    case "boolean": {
      return ok(type1 === type2 && obj1 === obj2);
    }
    case "object": {
      const isArray1 = Array.isArray(obj1);
      const isArray2 = Array.isArray(obj2);

      if (isArray1 || isArray2) {
        if (isArray1 && isArray2) {
          return arrayEq(obj1, obj2);
        } else {
          return ok(false);
        }
      }

      return objectEq(obj1, obj2);
    }
    default: {
      assertUnreachable(type1);
    }
  }
}

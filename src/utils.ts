import { Result } from "./result";

export function assertUnreachable(x: never): never {
  throw new Error("unreachable");
}

export function unwrap<T>(result: Result<T, any>) {
  if (!result.ok) throw new Error("unwrapped error result");

  return result.value;
}

export function arrayEq(arr1: any[], arr2: any[]): Result<boolean, string> {
  if (arr1.length !== arr2.length)
    return {
      ok: true,
      value: false,
    };

  for (let i = 0; i < arr1.length; i++) {
    const elem1 = arr1[i];
    const elem2 = arr2[i];

    const res = eq(elem1, elem2);
    if (!res.ok) {
      return res;
    }

    if (res.value === false) {
      return {
        ok: true,
        value: false,
      };
    }
  }

  return {
    ok: true,
    value: true,
  };
}

function objectEq(
  obj1: { [k: string]: any },
  obj2: { [k: string]: any },
): Result<boolean, string> {
  const keys1 = Object.keys(obj1).toSorted();
  const keys2 = Object.keys(obj2).toSorted();
  const neqRes = {
    ok: true,
    value: false,
  } as const;

  if (keys1.length !== keys2.length) {
    return neqRes;
  }

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return neqRes;
    }

    const res = eq(obj1[keys1[i]], obj2[keys2[i]]);
    if (!res.ok) {
      return res;
    }

    if (res.value === false) {
      return neqRes;
    }
  }
  return {
    ok: true,
    value: true,
  };
}

const SUPPORTED_TYPES = [
  "string",
  "number",
  "boolean",
  "undefined",
  "object",
] as const;

export function getSupportedType<T extends (typeof SUPPORTED_TYPES)[number]>(
  value: T,
): Result<(typeof SUPPORTED_TYPES)[number], string> {
  const type = typeof value;

  if (["string", "number", "boolean", "undefined", "object"].includes(type)) {
    return {
      ok: true,
      value: type as (typeof SUPPORTED_TYPES)[number],
    };
  }

  return {
    ok: false,
    error: `"${type}" not supported`,
  };
}

export function eq(obj1: any, obj2: any): Result<boolean, string> {
  const type1Res = getSupportedType(obj1);
  const type2Res = getSupportedType(obj2);

  if (!type1Res.ok) {
    return {
      ok: false,
      error: `obj1: ${type1Res.error}`,
    };
  }

  if (!type2Res.ok) {
    return {
      ok: false,
      error: `obj2: ${obj2.error}`,
    };
  }

  const type1 = type1Res.value;
  const type2 = type2Res.value;
  switch (type1) {
    case "undefined":
    case "string":
    case "number":
    case "boolean": {
      return {
        ok: true,
        value: type1 === type2 && obj1 === obj2,
      };
    }
    case "object": {
      const isArray1 = Array.isArray(obj1);
      const isArray2 = Array.isArray(obj2);

      if (isArray1 || isArray2) {
        if (isArray1 && isArray2) {
          return arrayEq(obj1, obj2);
        } else {
          return {
            ok: true,
            value: false,
          };
        }
      }

      return objectEq(obj1, obj2);
    }
    default: {
      assertUnreachable(type1);
    }
  }
}

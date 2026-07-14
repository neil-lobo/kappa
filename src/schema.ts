import { err, ok, Result } from "./result";
import {
  assertUnreachable,
  eq,
  getSupportedType,
  SupportedType,
} from "./utils";

import { null as null_ } from "chatterino.json";

export type SchemaString = { type: "string" };
export type SchemaNumber = { type: "number" };
export type SchemaBoolean = { type: "boolean" };
export type SchemaAny = { type: "any" };

export type SchemaPrimative =
  | SchemaString
  | SchemaNumber
  | SchemaBoolean
  | SchemaAny;

export type SchemaArray = { type: "array"; element: Schema };
export type SchemaObject = { type: "object"; fields: { [k: string]: Schema } };

export type Schema = SchemaPrimative | SchemaArray | SchemaObject;

export type SchemaToParseResult<T extends Schema> = T extends SchemaString
  ? string
  : T extends SchemaNumber
    ? number
    : T extends SchemaBoolean
      ? boolean
      : T extends { type: "array"; element: infer E extends Schema }
        ? SchemaToParseResult<E>[]
        : T extends {
              type: "object";
              fields: infer F extends { [k: string]: Schema };
            }
          ? { [K in keyof F]: SchemaToParseResult<F[K]> }
          : never;

function string(): SchemaString {
  return {
    type: "string",
  };
}

function number(): SchemaNumber {
  return {
    type: "number",
  };
}

function boolean(): SchemaBoolean {
  return {
    type: "boolean",
  };
}

function any(): SchemaAny {
  return {
    type: "any",
  };
}

function object<T extends { [k: string]: Schema }>(
  obj: T,
): {
  type: "object";
  fields: T;
} {
  const keys = Object.keys(obj);

  const fields: { [k: string]: Schema } = {};

  for (const key of keys) {
    const value = obj[key];

    let fieldValue: Schema;
    const type = value.type;
    switch (type) {
      case "string": {
        fieldValue = string();
        break;
      }
      case "number": {
        fieldValue = number();
        break;
      }
      case "boolean": {
        fieldValue = boolean();
        break;
      }
      case "any": {
        fieldValue = any();
        break;
      }
      case "object": {
        fieldValue = object(value.fields);
        break;
      }
      case "array": {
        fieldValue = array(value.element);
        break;
      }
      default: {
        assertUnreachable(type);
      }
    }

    fields[key] = fieldValue;
  }

  return {
    type: "object",
    fields: fields as T,
  };
}

function array<T extends Schema>(element: T): { type: "array"; element: T } {
  return {
    type: "array",
    element,
  };
}

export function schemaEq(
  schema1: Schema,
  schema2: Schema,
): Result<boolean, string> {
  return eq(schema1, schema2);
}

function parse<T extends Schema>(
  schema: T,
  value: any,
): Result<SchemaToParseResult<T>, string> {
  const type = schema.type;
  const valueTypeRes = getSupportedType(value);
  if (!valueTypeRes.ok) {
    return valueTypeRes;
  }

  const valueType = valueTypeRes.value;

  if (type !== "any" && !Array.isArray(value) && valueType !== type) {
    return err(`Expected ${type}, got ${valueType}`);
  }

  switch (type) {
    case "string":
    case "number":
    case "boolean": {
      if (valueType === type) {
        return ok(value);
      } else {
        return err(`Expected ${type}, got ${valueType}`);
      }
    }
    case "any": {
      return ok(value);
    }
    case "array": {
      const _value = value as SupportedType[];

      const out = [];
      for (let i = 0; i < _value.length; i++) {
        const elem = _value[i];
        const res = parse(schema.element, elem);
        if (!res.ok) {
          return err(`At [${i}]: ${res.error}`);
        } else {
          out.push(res.value);
        }
      }

      return ok(out as any);
    }
    case "object": {
      const out: { [k: string]: SchemaToParseResult<T> } = {};
      for (const [k, v] of Object.entries(schema.fields)) {
        const res = parse(v, value[k]);
        if (!res.ok) {
          return res;
        }

        out[k] = res.value as SchemaToParseResult<T>;
      }

      return ok(out as any);
    }
    default: {
      assertUnreachable(type);
    }
  }
}

export const s = {
  string,
  number,
  boolean,
  any,
  array,
  object,
  parse,
};

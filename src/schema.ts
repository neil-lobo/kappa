import { assertUnreachable } from "./utils";

export type SchemaString = { type: "string" };
export type SchemaNumber = { type: "number" };
export type SchemaBoolean = { type: "boolean" };

export type SchemaPrimative = SchemaString | SchemaNumber | SchemaBoolean;

export type SchemaArray = { type: "array"; element: Schema };
export type SchemaObject = { type: "object"; fields: { [k: string]: Schema } };

export type Schema = SchemaPrimative | SchemaArray | SchemaObject;

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

function schemaEq(schema1: Schema, schema2: Schema) {
  if (schema1.type !== schema2.type) return false;

  const type = schema1.type;
  switch (type) {
    case "string":
    case "number":
    case "boolean": {
      return true;
    }
    case "array": {
      return schemaEq(schema1.element, (schema2 as SchemaArray).element);
    }
    case "object": {
      const keys1 = Object.keys(schema1.fields).toSorted();
      const keys2 = Object.keys((schema2 as SchemaObject).fields).toSorted();

      if (keys1.length !== keys2.length) return false;

      for (let i = 0; i < keys1.length; i++) {
        if (keys1[i] !== keys2[i]) return false;

        if (
          !schemaEq(
            schema1.fields[keys1[i]],
            (schema2 as SchemaObject).fields[keys2[i]],
          )
        )
          return false;
      }
      return true;
    }
    default: {
      assertUnreachable(type);
    }
  }
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
        fieldValue = {
          type: "string",
        } satisfies SchemaString;
        break;
      }
      case "number": {
        fieldValue = {
          type: "number",
        } satisfies SchemaNumber;
        break;
      }
      case "boolean": {
        fieldValue = {
          type: "boolean",
        } satisfies SchemaBoolean;
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

export const s = {
  string,
  number,
  boolean,
  array,
  object,
  schemaEq,
};

// type A = SchemaResult<typeof a>;

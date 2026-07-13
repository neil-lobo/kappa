import { parse, stringify } from "chatterino.json";
import { readFile, writeFile } from "./fs";
import { s, SchemaObject, SchemaToParseResult } from "./schema";
import { err, ok, Result } from "./result";
import { assertUnreachable } from "./utils";

export class SettingsController<T extends SchemaObject> {
  _settings: SchemaToParseResult<T>;
  _filePath: string;
  _schema: T;
  _keys: (keyof SchemaToParseResult<T>)[];

  constructor(
    schema: T,
    defaultValues: SchemaToParseResult<T>,
    options: {
      filePath: string;
    } = {
      filePath: "settings.json",
    },
  ) {
    this._schema = schema;
    this._keys = Object.keys(schema.fields);
    this._settings = defaultValues;
    this._filePath = options.filePath;

    this.loadSettings();
  }

  getKey<K extends keyof typeof this._settings>(key: K): Result<K, string> {
    if (this._keys.includes(key)) {
      return ok(key);
    }

    return err(`Key not found: ${key as any}`);
  }

  getSetting<K extends keyof typeof this._settings>(
    key: K,
  ): Result<(typeof this._settings)[K], string> {
    const keyRes = this.getKey(key);
    if (!keyRes.ok) {
      return keyRes;
    }

    const type = this._schema.fields[key as any].type;
    switch (type) {
      case "string":
      case "number":
      case "boolean": {
        return ok(this._settings[keyRes.value]);
      }
      case "array": {
        const arr = Array.from(
          this._settings[keyRes.value] as any[],
        ) as (typeof this._settings)[K];

        return ok(arr);
      }
      case "object": {
        const obj = {
          ...(this._settings[keyRes.value] as any),
        } as (typeof this._settings)[K];

        return ok(obj);
      }
      default: {
        assertUnreachable(type);
      }
    }
  }

  setSetting<K extends keyof (typeof this._schema)["fields"]>(
    key: K,
    value: SchemaToParseResult<(typeof this._schema)["fields"][K]>,
  ): Result<void, string> {
    const keyRes = this.getKey(key as any);
    if (!keyRes.ok) {
      return keyRes;
    }

    const schema = this._schema.fields[keyRes.value as any];
    const parseRes = s.parse(schema, value);
    if (!parseRes.ok) {
      return parseRes;
    }

    const preValRes = this.getSetting(keyRes.value);
    if (!preValRes.ok) {
      return preValRes;
    }

    // @ts-ignore
    this._settings[keyRes.value] = parseRes.value;
    const flushRes = this.flushSettings();
    if (!flushRes) {
      // @ts-ignore
      this._settings[keyRes.value] = preValRes.value;
      return flushRes;
    }

    return ok(undefined);
  }

  loadSettings() {
    const readRes = readFile(this._filePath);

    if (!readRes.ok) {
      // TODO: log error
      return;
    }

    const parseRes = s.parse(this._schema, parse(readRes.value));
    if (!parseRes.ok) {
      return parseRes;
    }

    this._settings = parseRes.value;
  }

  flushSettings(): Result<void, string> {
    return writeFile(
      this._filePath,
      "w",
      stringify(this._settings, {
        pretty: true,
      }),
    );
  }
}

import { Result } from "./result";

export type WriteMode = "w" | "a";

export function writeFile(
  path: string,
  mode: WriteMode,
  data: string,
): Result<void, string> {
  const [file, errStr] = io.open(path, mode);

  if (!file) {
    return {
      ok: false,
      error: errStr,
    };
  }

  const [written, writtenErrStr] = file.write(data);
  if (!written) {
    return {
      ok: false,
      error: writtenErrStr,
    };
  }

  file.close();

  return {
    ok: true,
    value: undefined,
  };
}

export function readFile(path: string): Result<string, string> {
  const [file, errStr] = io.open(path, "r");

  if (!file) {
    return {
      ok: false,
      error: errStr,
    };
  }

  const data = file.read("a");
  if (!data) {
    return {
      ok: false,
      error: "No data read",
    };
  }

  return {
    ok: true,
    value: data,
  };
}

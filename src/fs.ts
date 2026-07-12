import { err, ok, Result } from "./result";

export type WriteMode = "w" | "a";

export function writeFile(
  path: string,
  mode: WriteMode,
  data: string,
): Result<void, string> {
  const [file, errStr] = io.open(path, mode);

  if (!file) {
    return err(errStr);
  }

  const [written, writtenErrStr] = file.write(data);
  if (!written) {
    return err(writtenErrStr);
  }

  file.close();

  return ok(undefined);
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

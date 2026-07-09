export type WriteMode = "w" | "a";

export function writeFile(
  path: string,
  mode: WriteMode,
  data: string,
): LuaMultiReturn<[undefined] | [undefined, string]> {
  const [file, errStr] = io.open(path, mode);

  if (!file) {
    return $multi(undefined, errStr);
  }

  const [written, writtenErrStr] = file.write(data);
  if (!written) {
    return $multi(undefined, writtenErrStr);
  }

  file.close();

  return $multi(undefined);
}

export function readFile(
  path: string,
): LuaMultiReturn<[string] | [undefined, string]> {
  const [file, errStr] = io.open(path, "r");

  if (!file) {
    return $multi(undefined, errStr);
  }

  const data = file.read("a");
  if (!data) {
    return $multi(undefined, "Read no data");
  }

  return $multi(data);
}

interface HTTPHeaders {
  len(): number;
  clone(): HTTPHeaders;
  append(name: string, value: string, never_index?: boolean): void;
  each(): LuaIterable<LuaMultiReturn<[string, string, boolean]>>;
  has(name: string): boolean;
  delete(name: string): void;
  get(name: string): LuaMultiReturn<string[]>;
  upsert(name: string, value: string, next_index?: boolean): void;
}

interface HTTPRequest {
  headers: HTTPHeaders;
  setBody(body: string): void;
  go(timeout: number): LuaMultiReturn<[HTTPHeaders, HTTPStream]>;
}

interface HTTPStream {
  get_body_as_string(
    timeout?: number,
  ): LuaMultiReturn<[string] | [null, string, number]>;
}

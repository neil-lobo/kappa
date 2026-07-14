import { FetchOptions, HTTPResponse } from "../src/fetch";
import {
  writeFile as realWriteFile,
  WriteMode,
  readFile as readlReadFile,
} from "../src/fs";
import { new_from_uri } from "http.request";

// @ts-ignore
import * as impl from "./lua/json";
const json: {
  encode: (obj: any) => string;
  decode: (str: string) => any;
} = impl;

const LogLevel = {
  Debug: 0,
  Info: 1,
  Warning: 2,
  Critical: 3,
};

const HTTPMethod = {
  Get: 0,
  Post: 1,
  Put: 2,
  Delete: 3,
  Patch: 4,
};

const HTTPMethodStr = {
  [HTTPMethod.Get]: "GET",
  [HTTPMethod.Post]: "POST",
  [HTTPMethod.Put]: "PUT",
  [HTTPMethod.Delete]: "DELETE",
  [HTTPMethod.Patch]: "PATCH",
};

const DEFAULT_OPTIONS: FetchOptions = {
  method: HTTPMethod.Get,
};

globalThis.c2 = {
  log: (level: c2.LogLevel, ...messages: any[]): void => {
    print("chatterino.lua: [kappa:Kappa Test Suite]", ...messages);
  },
  LogLevel,
  HTTPMethod,
} as typeof c2;

const mockFs = {
  writeFile: (
    path: string,
    mode: WriteMode,
    data: string,
  ): ReturnType<typeof realWriteFile> => {
    return realWriteFile(`data_test/${path}`, mode, data);
  },

  readFile: (path: string): ReturnType<typeof readlReadFile> => {
    return readlReadFile(`data_test/${path}`);
  },
};

const mockJson = {
  /** @noSelf */
  parse: (str: string): any => json.decode(str),
  /** @noSelf */
  stringify: (
    obj: any,
    _opts?: { pretty?: boolean; indent_char?: string; indent_size?: number },
  ): string => json.encode(obj),
};

const mockFetch = {
  fetch: async function fetch(
    url: string,
    options?: Partial<FetchOptions>,
  ): Promise<HTTPResponse> {
    const _options = Object.assign(DEFAULT_OPTIONS, options);

    const req = new_from_uri(url);
    req.headers.upsert(":method", HTTPMethodStr[_options.method]);

    for (const [k, v] of Object.entries(_options.headers ?? {})) {
      req.headers.upsert(k, v);
    }

    if (_options.body) {
      req.setBody(_options.body);
    }

    const [headers, stream] = req.go(_options.timeout ?? 30);

    for (const [k, v] of headers.each()) {
      print(k, v);
    }

    const [_status] = headers.get(":status");

    let status: number | null = null;
    if (_status !== null) {
      status = Number(_status);
    }

    return Promise.resolve({
      data: "",
      error: "",
      status,
    });

    return {} as any;
    // const req = c2.HTTPRequest.create(_options.method, url);
    // const req

    // for (const [k, v] of Object.entries(_options.headers ?? {})) {
    //   req.set_header(k, v);
    // }

    // if (_options.timeout) {
    //   req.set_timeout(_options.timeout);
    // }

    // if (_options.body) {
    //   req.set_payload(_options.body);
    // }

    // return new Promise((res) => {
    //   req.on_error((response) =>
    //     res({
    //       data: response.data(),
    //       error: response.error(),
    //       status: response.status(),
    //     }),
    //   );
    //   req.on_success((response) =>
    //     res({
    //       data: response.data(),
    //       error: response.error(),
    //       status: response.status(),
    //     }),
    //   );
    //   req.execute();
    // });
  },
};

// @ts-ignore
package.loaded["src.fs"] = mockFs;

// @ts-ignore
package.loaded["chatterino.json"] = mockJson;

// @ts-ignore
package.loaded["src.fetch"] = mockFetch;

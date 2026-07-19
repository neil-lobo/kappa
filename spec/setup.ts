import {
  writeFile as realWriteFile,
  WriteMode,
  readFile as readlReadFile,
} from "../src/fs";

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

class Channel {
  static by_name(name: string): null | Channel {
    return new Channel();
  }

  get_name(): string {
    return "2547techno";
  }

  get_display_name(): string {
    return "2547techno";
  }

  is_twitch_channel(): boolean {
    return true;
  }

  get_twitch_id(): string {
    return "64600767";
  }
}

globalThis.c2 = {
  log: (level: c2.LogLevel, ...messages: any[]): void => {
    print("chatterino.lua: [kappa:Kappa Test Suite]", ...messages);
  },
  LogLevel,
  HTTPMethod,
  Channel,
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

// @ts-ignore
package.loaded["src.fs"] = mockFs;

// @ts-ignore
package.loaded["chatterino.json"] = mockJson;

import {
  writeFile as realWriteFile,
  WriteMode,
  readFile as readlReadFile,
} from "../src/fs";

const LogLevel = {
  Debug: 0,
  Info: 1,
  Warning: 2,
  Critical: 3,
};

const LogLevelStr: Record<number, string> = {
  0: "Debug",
  1: "Info",
  2: "Warning",
  3: "Critical",
};

globalThis.c2 = {
  log: (level: c2.LogLevel, ...messages: any[]): void => {
    print("chatterino.lua: [kappa:Kappa Test Suite]", ...messages);
  },
  LogLevel,
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

// @ts-ignore
package.loaded["src.fs"] = mockFs;
// @ts-ignore
package.loaded["src/fs"] = mockFs;

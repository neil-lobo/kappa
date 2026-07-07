// @ts-ignore
import * as impl from "./lua/fs";

export const fs: {
  read: (filename: string) => string;
  write: (filename: string, data: string) => void;
} = impl;

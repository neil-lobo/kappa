import { writeFile } from "./fs";

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export const LOG_LEVEL_STR: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
};

export const C2_LOG_LEVEL: Record<LogLevel, c2.LogLevel> = {
  [LogLevel.DEBUG]: c2.LogLevel.Debug,
  [LogLevel.INFO]: c2.LogLevel.Info,
  [LogLevel.WARN]: c2.LogLevel.Warning,
  [LogLevel.ERROR]: c2.LogLevel.Critical,
};

export type LoggerOutput =
  | {
      type: "console";
    }
  | {
      type: "file";
      // maybe dirName instead of fileName to handle rolling file/message limits?
      filename: string;
      // TODO: message limit
    }
  | {
      type: "memory";
      // TODO: message limit
    };

export type LoggerParams = {
  level: LogLevel;
  prefix?: string;
  prefixLevel: boolean;
  outputs: LoggerOutput[];
};

export class Logger {
  _defaultParam: LoggerParams = {
    level: LogLevel.INFO,
    prefixLevel: false,
    outputs: [
      {
        type: "console",
      },
    ],
  };
  _params: LoggerParams;
  _logs: { level: LogLevel; text: string }[] = [];
  _fileOutputError: string | undefined;

  constructor(params: Partial<LoggerParams> = {}) {
    this._params = Object.assign(this._defaultParam, params);
  }

  log(level: LogLevel, ...messages: string[]) {
    if (this._params.level > level) return;

    const _messages = [];

    if (this._params.prefixLevel) {
      _messages.push(`[${LOG_LEVEL_STR[level]}]`);
    }

    if (this._params.prefix) {
      _messages.push(this._params.prefix);
    }

    for (const message of messages) {
      _messages.push(message);
    }

    const _outputs = new Set<LoggerOutput>(this._params.outputs);

    const messageStr = _messages.join(" ");

    for (const output of _outputs) {
      switch (output.type) {
        case "console": {
          c2.log(C2_LOG_LEVEL[level], messageStr);
          break;
        }
        case "file": {
          if (this._fileOutputError) break;
          const res = writeFile(output.filename, "a", `${messageStr}\n`);
          if (!res.ok) {
            this._fileOutputError = res.error;
            this.error("Unable to write log to file:", res.error);
          }

          break;
        }
        case "memory": {
          this._logs.push({
            level,
            text: messageStr,
          });
          break;
        }
      }
    }
  }

  getMemoryLogs() {
    return [...this._logs];
  }

  clearMemoryLogs() {
    this._logs = [];
  }

  debug(...message: string[]) {
    this.log(LogLevel.DEBUG, ...message);
  }

  info(...message: string[]) {
    this.log(LogLevel.INFO, ...message);
  }

  warn(...message: string[]) {
    this.log(LogLevel.WARN, ...message);
  }

  error(...message: string[]) {
    this.log(LogLevel.ERROR, ...message);
  }
}

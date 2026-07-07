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

// 2. Define the mock implementation
globalThis.c2 = {
  log: (level: c2.LogLevel, ...message: any[]): void => {
    const levelStr = LogLevelStr[level] ?? `LEVEL-${level}`;
    print(`[${levelStr}]`, ...message);
  },
  LogLevel,
} as typeof c2;

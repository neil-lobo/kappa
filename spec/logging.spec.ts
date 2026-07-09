import { readFile } from "../src";
import { LOG_LEVEL_STR, Logger, LogLevel } from "../src/logger";

describe("logger", () => {
  const logs: { level: LogLevel; text: string }[] = [
    {
      level: LogLevel.DEBUG,
      text: "debug log",
    },
    {
      level: LogLevel.INFO,
      text: "info log",
    },
    {
      level: LogLevel.WARN,
      text: "warn log",
    },
    {
      level: LogLevel.ERROR,
      text: "error log",
    },
  ];

  function logLogs(logger: Logger) {
    for (const log of logs) {
      switch (log.level) {
        case LogLevel.DEBUG:
          logger.debug(log.text);
          break;
        case LogLevel.INFO:
          logger.info(log.text);
          break;
        case LogLevel.WARN:
          logger.warn(log.text);
          break;
        case LogLevel.ERROR:
          logger.error(log.text);
          break;
      }
    }
  }

  it("logs levels", () => {
    const log = new Logger({
      level: LogLevel.DEBUG,
      outputs: [
        {
          type: "memory",
        },
      ],
    });

    logLogs(log);
    const memLogs = log.getMemoryLogs();

    assert.equals(logs.length, memLogs.length);

    for (let i = 0; i < logs.length; i++) {
      assert.equals(logs[i].level, memLogs[i].level);
      assert.equals(logs[i].text, memLogs[i].text);
    }
  });

  it("multiple strings", () => {
    const log = new Logger({
      level: LogLevel.DEBUG,
      outputs: [
        {
          type: "memory",
        },
      ],
    });

    log.debug("foo", "bar", "baz");

    const memLogs = log.getMemoryLogs();

    assert.equals(1, memLogs.length);
    assert.equals(LogLevel.DEBUG, memLogs[0].level);
    assert.equals("foo bar baz", memLogs[0].text);
  });

  it("file log", () => {
    const filename = "0.log";

    const _log = new Logger({
      level: LogLevel.DEBUG,
      outputs: [
        {
          type: "file",
          filename,
        },
      ],
    });

    logLogs(_log);

    const [data] = readFile(filename);
    assert.equals(`${logs.map((l) => l.text).join("\n")}\n`, data);
  });

  it("min log level", () => {
    const log = new Logger({
      level: LogLevel.WARN,
      outputs: [
        {
          type: "memory",
        },
      ],
    });

    logLogs(log);

    const memLogs = log.getMemoryLogs();
    assert.equals(2, memLogs.length);
    const expected = logs.slice(2);
    assert.equals(expected.length, memLogs.length);

    for (let i = 0; i < expected.length; i++) {
      assert.equals(expected[i].level, memLogs[i].level);
      assert.equals(expected[i].text, memLogs[i].text);
    }
  });

  it("prefix", () => {
    const prefix = "[foobar prefix]";
    const log = new Logger({
      level: LogLevel.DEBUG,
      prefix,
      outputs: [
        {
          type: "memory",
        },
      ],
    });

    logLogs(log);
    const memLogs = log.getMemoryLogs();
    assert.equals(logs.length, memLogs.length);

    for (let i = 0; i < logs.length; i++) {
      assert.equals(logs[i].level, memLogs[i].level);
      assert.equals(`${prefix} ${logs[i].text}`, memLogs[i].text);
    }
  });

  it("prefix level", () => {
    const log = new Logger({
      level: LogLevel.DEBUG,
      prefixLevel: true,
      outputs: [
        {
          type: "memory",
        },
      ],
    });

    logLogs(log);
    const memLogs = log.getMemoryLogs();
    assert.equals(logs.length, memLogs.length);

    for (let i = 0; i < logs.length; i++) {
      assert.equals(logs[i].level, memLogs[i].level);
      assert.equals(
        `[${LOG_LEVEL_STR[logs[i].level]}] ${logs[i].text}`,
        memLogs[i].text,
      );
    }
  });
});

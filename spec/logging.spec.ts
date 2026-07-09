import { Logger, LogLevel } from "../src/logger";

describe("logger", () => {
  const log = new Logger({
    level: LogLevel.DEBUG,
  });

  it("logs levels", () => {
    log.debug("debug");
    log.info("info");
    log.warn("warning");
    log.error("error");
  });

  it("multiple strings", () => {
    log.debug("foo", "bar", "baz");
  });
});

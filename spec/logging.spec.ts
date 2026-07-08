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

  it("lists", () => {
    c2.log(c2.LogLevel.Debug, [1, 2, 3], [4, 5, 6]);
  });

  it("objects", () => {
    c2.log(
      c2.LogLevel.Debug,
      {
        id: 1,
        foo: "bar",
      },
      {
        id: 2,
        foo: "baz",
      },
    );
  });
});

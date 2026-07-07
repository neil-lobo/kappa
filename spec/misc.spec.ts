import { fs } from "../src/fs";
import { randomId } from "../src/id";

describe("log tests", () => {
  it("logs levels", () => {
    c2.log(c2.LogLevel.Debug, "debug");
    c2.log(c2.LogLevel.Info, "info");
    c2.log(c2.LogLevel.Warning, "warning");
    c2.log(c2.LogLevel.Critical, "critical");
  });

  it("multiple strings", () => {
    c2.log(c2.LogLevel.Debug, "foo", "bar", "baz");
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

describe("fs tests", () => {
  const rawSettings = `
{
  "foo": "bar",
  "baz": {
    "fizz": "buzz"
  },
  "arr": [1, 2, 3],
  "objs": [
    {
      "id": 1,
      "body": "fizzbuzz"
    },
    {
      "id": 2,
      "body": "ipsum"
    }
  ]
}  
`;

  it("write", () => {
    fs.write("data_test/settings.json", rawSettings);
  });

  it("read", () => {
    fs.read("data_test/settings.json");
  });
});

describe("misc tests", () => {
  it("random id", () => {
    c2.log(c2.LogLevel.Debug, randomId(16));
  });
});

import { writeFile, readFile } from "../src";

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
    const [_, errStr] = writeFile("data_test/settings.json", "w", rawSettings);
    assert.equals(undefined, errStr);
  });

  it("read", () => {
    const [data, errStr] = readFile("data_test/settings.json");

    assert.equals(undefined, errStr);
    assert.equals(rawSettings, data);
  });

  it("append", () => {
    const lines = [
      "Excepteur magna qui enim voluptate laboris Lorem ipsum incididunt irure reprehenderit proident id cillum.",
      "Voluptate officia et deserunt in culpa.",
      "Est quis occaecat et eu cillum voluptate amet culpa cupidatat minim.",
    ];

    for (const line of lines) {
      const [_, errStr] = writeFile("data_test/poem.txt", "a", `${line}\n`);

      assert.equals(undefined, errStr);
    }

    const [data] = readFile("data_test/poem.txt");
    assert.equals(`${lines.join("\n")}\n`, data);
  });
});

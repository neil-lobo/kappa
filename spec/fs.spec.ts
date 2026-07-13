import { writeFile, readFile } from "../src/fs";

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
    const res = writeFile("_settings.json", "w", rawSettings);

    assert.is_true(res.ok);
  });

  it("read", () => {
    const res = readFile("_settings.json");

    assert.is_true(res.ok);
    assert.equals(rawSettings, res.value);
  });

  it("append", () => {
    const lines = [
      "Excepteur magna qui enim voluptate laboris Lorem ipsum incididunt irure reprehenderit proident id cillum.",
      "Voluptate officia et deserunt in culpa.",
      "Est quis occaecat et eu cillum voluptate amet culpa cupidatat minim.",
    ];

    for (const line of lines) {
      const res = writeFile("poem.txt", "a", `${line}\n`);

      assert.is_true(res.ok);
    }

    const res = readFile("poem.txt");
    assert.is_true(res.ok);
    assert.equals(`${lines.join("\n")}\n`, res.value);
  });
});

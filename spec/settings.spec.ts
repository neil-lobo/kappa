import { stringify } from "chatterino.json";
import { unwrap } from "../src/result";
import { s, SchemaToParseResult } from "../src/schema";
import { SettingsController } from "../src/settings";
import { eq } from "../src/utils";

describe("settings tests", () => {
  it("getSetting", () => {
    const schema = s.object({
      foo: s.boolean(),
      bar: s.array(s.number()),
      baz: s.object({
        fizz: s.number(),
        buzz: s.string(),
      }),
    });

    const defaultValues: SchemaToParseResult<typeof schema> = {
      foo: false,
      bar: [1, 2, 3],
      baz: {
        fizz: 1,
        buzz: "3",
      },
    };

    const settings = new SettingsController(schema, defaultValues);

    assert.equals(defaultValues.foo, unwrap(settings.getSetting("foo")));
    assert.is_true(
      unwrap(eq(defaultValues.bar, unwrap(settings.getSetting("bar")))),
    );
    assert.is_true(
      unwrap(eq(defaultValues.baz, unwrap(settings.getSetting("baz")))),
    );
  });

  describe("setSetting", () => {
    const schema = s.object({
      foo: s.number(),
      bar: s.array(
        s.object({
          fizz: s.string(),
          buzz: s.boolean(),
        }),
      ),
    });

    const defaultValues: SchemaToParseResult<typeof schema> = {
      foo: 1,
      bar: [],
    };

    it("primative", () => {
      const settings = new SettingsController(schema, defaultValues);

      assert.equals(defaultValues.foo, unwrap(settings.getSetting("foo")));
      const newVal = 123;
      const res = settings.setSetting("foo", newVal);
      assert.is_true(res.ok);
      assert.equals(newVal, unwrap(settings.getSetting("foo")));
    });

    it("complex", () => {
      const settings = new SettingsController(schema, defaultValues);

      const value = unwrap(settings.getSetting("bar"));
      value.push({
        fizz: "fiz",
        buzz: false,
      });

      assert.is_true(
        unwrap(eq(defaultValues.bar, unwrap(settings.getSetting("bar")))),
      );
      const res = settings.setSetting("bar", value);
      assert.is_true(res.ok);
      assert.is_true(unwrap(eq(value, unwrap(settings.getSetting("bar")))));
    });
  });
});

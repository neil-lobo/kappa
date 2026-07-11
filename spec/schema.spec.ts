import { s, schemaEq } from "../src/schema";
import { eq, unwrap } from "../src/utils";

// TODO: test error messages?
describe("schema tests", () => {
  describe("schemaEq", () => {
    describe("primative", () => {
      it("string", () => {
        assert.is_true(unwrap(schemaEq(s.string(), s.string())));
      });
      it("number", () => {
        assert.is_true(unwrap(schemaEq(s.number(), s.number())));
      });
      it("boolean", () => {
        assert.is_true(unwrap(schemaEq(s.boolean(), s.boolean())));
      });

      describe("array", () => {
        it("eq", () => {
          assert.is_true(
            unwrap(schemaEq(s.array(s.number()), s.array(s.number()))),
          );
        });
        it("neq", () => {
          assert.is_true(!unwrap(schemaEq(s.array(s.string()), s.number())));
        });
      });

      describe("object", () => {
        it("eq", () => {
          assert.is_true(
            unwrap(
              schemaEq(
                s.object({
                  foo: s.string(),
                  bar: s.number(),
                }),
                s.object({
                  foo: s.string(),
                  bar: s.number(),
                }),
              ),
            ),
          );
        });

        it("neq keys", () => {
          assert.is_true(
            !unwrap(
              schemaEq(
                s.object({
                  foo: s.string(),
                  bar: s.number(),
                }),
                s.object({
                  foo: s.string(),
                  baz: s.number(),
                }),
              ),
            ),
          );
        });

        it("neq field type", () => {
          assert.is_true(
            !unwrap(
              schemaEq(
                s.object({
                  foo: s.string(),
                  bar: s.number(),
                }),
                s.object({
                  foo: s.string(),
                  bar: s.boolean(),
                }),
              ),
            ),
          );
        });
      });
    });
  });

  describe("parse", () => {
    describe("success", () => {
      describe("primative", () => {
        describe("string", () => {
          it("normal", () => {
            const schema = s.string();
            const value = "foobar";

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });

          it("empty", () => {
            const schema = s.string();
            const value = "";

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });
        });

        describe("number", () => {
          it("normal", () => {
            const schema = s.number();
            const value = 3487;

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });

          it("zero", () => {
            const schema = s.number();
            const value = 0;

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });
        });

        describe("boolean", () => {
          it("true", () => {
            const schema = s.boolean();
            const value = true;

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });

          it("false", () => {
            const schema = s.boolean();
            const value = false;

            const res = s.parse(schema, value);

            assert.is_true(res.ok);
            assert.equals(value, res.value);
          });
        });
      });

      describe("array", () => {
        it("primative", () => {
          const schema = s.array(s.number());
          const value = [2, 3, 4, 5];

          const res = s.parse(schema, value);

          assert.is_true(res.ok);
          assert.is_true(unwrap(eq(value, res.value)));
        });

        it("complex", () => {
          const schema = s.array(
            s.object({
              foo: s.boolean(),
              bar: s.object({
                baz: s.array(
                  s.object({
                    fizz: s.number(),
                  }),
                ),
              }),
            }),
          );
          const value = [
            {
              foo: false,
              bar: {
                baz: [{ fizz: 0 }, { fizz: 1 }, { fizz: 2 }],
              },
            },
            {
              foo: true,
              bar: {
                baz: [{ fizz: 3 }, { fizz: 4 }, { fizz: 5 }],
              },
            },
          ];

          const res = s.parse(schema, value);

          assert.is_true(res.ok);
          assert.is_true(unwrap(eq(value, res.value)));
        });
      });
    });

    describe("error", () => {
      describe("primative", () => {
        it("string", () => {
          const schema = s.string();
          const value = 53;

          const res = s.parse(schema, value);

          assert.equals(false, res.ok);
        });

        it("number", () => {
          const schema = s.number();
          const value = true;

          const res = s.parse(schema, value);

          assert.equals(false, res.ok);
        });

        it("boolean", () => {
          const schema = s.boolean();
          const value = "";

          const res = s.parse(schema, value);

          assert.equals(false, res.ok);
        });
      });

      describe("array", () => {
        it("primative", () => {
          const schema = s.array(s.string());
          const value = ["foo", true, 123];

          const res = s.parse(schema, value);

          assert.equals(false, res.ok);
        });

        it("complex", () => {
          const schema = s.array(
            s.object({
              foo: s.boolean(),
              bar: s.object({
                baz: s.array(
                  s.object({
                    fizz: s.number(),
                  }),
                ),
              }),
            }),
          );
          const value = [
            {
              foo: false,
              bar: {
                baz: [{ fizz: 0 }, { fizz: 1 }, { fizz: 2 }],
              },
            },
            {
              foo: true,
              bar: {
                baz: [{ fizz: 3 }, { fizz: 4 }, { buzz: 5 }],
              },
            },
          ];

          const res = s.parse(schema, value);

          assert.is_true(!res.ok);
        });
      });
    });
  });
});

import { s } from "../src/schema";

describe("schema tests", () => {
  describe("schemaEq", () => {
    describe("primative", () => {
      it("string", () => {
        assert.is_true(s.schemaEq(s.string(), s.string()));
      });
      it("number", () => {
        assert.is_true(s.schemaEq(s.number(), s.number()));
      });
      it("boolean", () => {
        assert.is_true(s.schemaEq(s.boolean(), s.boolean()));
      });

      describe("array", () => {
        it("eq", () => {
          assert.is_true(s.schemaEq(s.array(s.number()), s.array(s.number())));
        });
        it("neq", () => {
          assert.is_true(
            !s.schemaEq(s.array(s.string()), s.array(s.boolean())),
          );
        });
      });

      describe("object", () => {
        it("eq", () => {
          assert.is_true(
            s.schemaEq(
              s.object({
                foo: s.string(),
                bar: s.number(),
              }),
              s.object({
                foo: s.string(),
                bar: s.number(),
              }),
            ),
          );
        });

        it("neq keys", () => {
          assert.is_true(
            !s.schemaEq(
              s.object({
                foo: s.string(),
                bar: s.number(),
              }),
              s.object({
                foo: s.string(),
                baz: s.number(),
              }),
            ),
          );
        });

        it("neq field type", () => {
          assert.is_true(
            !s.schemaEq(
              s.object({
                foo: s.string(),
                bar: s.number(),
              }),
              s.object({
                foo: s.string(),
                bar: s.boolean(),
              }),
            ),
          );
        });
      });
    });
  });

  describe("validation", () => {});
});

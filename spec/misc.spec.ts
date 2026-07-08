import { randomId } from "../src/id";

describe("id tests", () => {
  it("randomId length", () => {
    const len = 16;
    const id = randomId(len);

    assert.equals(len, id.length);
  });
});

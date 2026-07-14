import { fetch } from "../src";
import { stringify } from "chatterino.json";

describe("fetch tests", () => {
  it("test", (done) => {
    // try {
    //   const res = await fetch("https://api.ipify.org/");
    //   print(stringify(res));
    //   assert.is_true(false);
    //   done();
    // } catch (err) {
    //   print("err");
    //   print(err);
    //   assert.is_true(false);
    //   // throw new Error();
    //   done();
    // }

    const resPromise = fetch("https://api.ipify.org/");
    resPromise
      .then((res) => {
        print("then");
        print(stringify(res));
      })
      .catch((err) => {
        print("err");
        print(err);
        print(print(false === err));
        assert.is_true(false);
        done(err);
      });
    // .finally(() => {
    //   print("finally");
    //   done();
    // });
  });
});

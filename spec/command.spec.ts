import { Logger } from "../src/logger";
import { Command } from "../src/command";
import { ok, unwrap } from "../src/result";
import { eq } from "../src/utils";

describe("command tests", () => {
  // const log = new Logger({
  //   outputs: [
  //     {
  //       type: "memory",
  //     },
  //   ],
  // });

  it("command chain", () => {
    const sub1a = new Command({
      command: "sub1a",
      action: (ctx, args) => ok(undefined),
    });

    const command = new Command({
      command: "command",
      subcommands: [
        new Command({
          command: "sub1",
          subcommands: [sub1a],
        }),
      ],
    });

    assert.is_true(
      unwrap(eq(sub1a.getCommandChain(), ["command", "sub1", "sub1a"])),
    );
  });
});

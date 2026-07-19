import { err, ok, Result } from "./result";

// export type CommandReply = {
//   reply(_message: string): void;
// };

export type CommandContext = c2.CommandContext /* & CommandReply */;

type CommandActionResult = Result<void, string>;
export type CommandParams<T extends string> = {
  command: string;
  parent?: Command<string>;
  // TODO: aliases?
} & (
  | {
      subcommands: Command<string>[];
    }
  | {
      args?: T[];
      action: (
        ctx: CommandContext,
        args: Record<T, string>,
      ) => CommandActionResult | Promise<CommandActionResult>;
    }
);

export class Command<T extends string> {
  params: CommandParams<T>;
  _parent: Command<string> | undefined;
  constructor(params: CommandParams<T>) {
    this.params = params;
    const subcommands = new Set<string>();

    if ("subcommands" in this.params) {
      for (const command of this.params.subcommands) {
        if (subcommands.has(command.params.command)) {
          throw new Error("subcommands must be unique");
        }

        subcommands.add(command.params.command);

        command._parent = this;
      }
    }
  }

  async run(
    ctx: CommandContext,
    args: string[],
  ): Promise<Result<void, string>> {
    if ("subcommands" in this.params) {
      if (args.length === 0) {
        const res = this.availableCommands();
        if (!res.ok) {
          return res;
        }
        return err(`Available commands: ${res.value.join(", ")}`);
      }
      const subcommand = this.params.subcommands.find(
        (c) => c.params.command === args[0],
      );
      if (!subcommand) {
        return err(`Unknown command: ${args[0]}`);
      }
      const _args = [...args];
      _args.shift();
      const res = await subcommand.run(ctx, _args);
      if (!res.ok) {
        return res;
      }
    } else {
      const keys = this.params.args ?? [];
      const vals = [...args];
      if (keys.length != vals.length) {
        return err(this.getUsageMessage());
      }
      const _args: Partial<Record<T, string>> = {};
      for (let i = 0; i < keys.length; i++) {
        _args[keys[i]] = vals[i];
      }
      const res = await this.params.action(ctx, _args as Record<T, string>);
      if (!res.ok) {
        return res;
      }
    }
    return ok(undefined);
  }

  getCommandChain(): string[] {
    if (!this._parent) {
      return [this.params.command];
    } else {
      return [...this._parent.getCommandChain(), this.params.command];
    }
  }

  availableCommands(): Result<string[], string> {
    if ("subcommands" in this.params) {
      return ok(this.params.subcommands.map((c) => c.params.command));
    } else {
      // unexpected error
      return err("Command has no subcommands");
    }
  }

  getUsageMessage() {
    let usage = "Usage: /";

    const chain = this.getCommandChain();
    usage += chain.join(" ");
    if ("args" in this.params && this.params.args) {
      usage += " ";
      usage += this.params.args.map((a) => `<${a}>`).join(" ");
    }

    return usage;
  }
}

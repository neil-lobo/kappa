/** @noSelfInFile */

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare namespace assert {
  function is_true(value: any): asserts value is true;
  function equals<T>(expected: T, actual: any): asserts actual is T;
}

declare function print(...str: any[]): void;

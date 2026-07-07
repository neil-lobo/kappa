/** @noSelfInFile */

declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void): void;
declare namespace assert {
  function is_true(value: any): void;
  function equals(expected: any, actual: any): void;
}

declare function print(...str: any[]): void;

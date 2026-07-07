import { randomId } from "./id";

const intervals: Set<string> = new Set();

export function setInterval(fn: () => void, ms: number): string {
  let id: string | undefined;
  while (!id || intervals.has(id)) {
    id = randomId(16);
  }

  intervals.add(id);
  const cb = () => {
    if (!intervals.has(id)) {
      return;
    }
    fn();
    c2.later(() => {
      cb();
    }, ms);
  };

  c2.later(() => {
    cb();
  }, ms);

  return id;
}

export function clearInterval(id: string) {
  intervals.delete(id);
}

export function randomId(length: number) {
  const digits = [];
  for (let i = 0; i < length; i++) {
    digits.push(Math.floor(Math.random() * 16).toString(16));
  }
  return digits.join("");
}

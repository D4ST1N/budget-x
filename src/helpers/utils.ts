export function timeout(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

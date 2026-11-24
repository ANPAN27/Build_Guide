// Fastify handles async errors natively; helper kept for explicit wrapping when desired.
export function wrap<T extends (...args: never[]) => Promise<unknown>>(fn: T): T {
  return fn;
}

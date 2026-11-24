import { describe, it, expect } from "vitest";
import { hashToken, randomToken, safeEqualHex } from "../../src/utils/crypto.js";

describe("crypto utils", () => {
  it("creates random token and stable hash", () => {
    const t1 = randomToken(16);
    const t2 = randomToken(16);
    expect(t1).toHaveLength(32);
    expect(t1).not.toBe(t2);
    expect(hashToken(t1)).toBe(hashToken(t1));
    expect(hashToken(t1)).not.toBe(t1);
  });
  it("compares hex safely", () => {
    const a = hashToken("abc");
    const b = hashToken("abc");
    const c = hashToken("def");
    expect(safeEqualHex(a, b)).toBe(true);
    expect(safeEqualHex(a, c)).toBe(false);
  });
});

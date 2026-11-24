import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/utils/password.js";

describe("password utils", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("StrongPass123");
    expect(hash).not.toContain("StrongPass123");
    expect(await verifyPassword(hash, "StrongPass123")).toBe(true);
    expect(await verifyPassword(hash, "wrong")).toBe(false);
  });
});

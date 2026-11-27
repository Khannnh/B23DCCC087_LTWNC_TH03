import { describe, expect, it } from "vitest";
import { can } from "./permissions";

describe("Quyền của người dùng", () => {
  it("khách chỉ được xem tin", () => {
    expect(can(undefined, "post:view")).toBe(true);
    expect(can(undefined, "post:create")).toBe(false);
    expect(can(undefined, "post:resolve")).toBe(false);
    expect(can(undefined, "post:moderate")).toBe(false);
  });

  it("thành viên được đăng và đánh dấu đã nhận lại", () => {
    expect(can("member", "post:view")).toBe(true);
    expect(can("member", "post:create")).toBe(true);
    expect(can("member", "post:resolve")).toBe(true);
    expect(can("member", "post:moderate")).toBe(false);
  });

  it("admin được kiểm duyệt tin", () => {
    expect(can("admin", "post:view")).toBe(true);
    expect(can("admin", "post:moderate")).toBe(true);
    expect(can("admin", "post:create")).toBe(false);
    expect(can("admin", "post:resolve")).toBe(false);
  });
});
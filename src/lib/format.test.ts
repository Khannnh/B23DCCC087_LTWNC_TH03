import { expect, it } from "vitest";
import { formatDate } from "./format";

it("đổi ngày từ năm-tháng-ngày sang ngày/tháng/năm", () => {
  expect(formatDate("2026-11-05")).toBe("05/11/2026");
});
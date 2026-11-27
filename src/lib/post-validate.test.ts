import { describe, expect, it } from "vitest";
import { toPostInput, validatePost } from "./post-validate";
import type { PostInput } from "./post-validate";

const validInput: PostInput = {
  title: "Mất tai nghe không dây",
  kind: "Thất lạc",
  category: "Khác",
  place: "Thư viện",
  date: "2020-01-01",
  description: "Mình làm mất tai nghe ở bàn gần cửa sổ.",
  contactType: "Zalo",
  contact: "0912345678",
};

describe("Kiểm tra dữ liệu đăng tin", () => {
  it("chấp nhận tin hợp lệ", () => {
    expect(validatePost(validInput)).toEqual({});
  });

  it("báo đủ lỗi khi gửi form trống", () => {
    expect(validatePost(toPostInput(new FormData()))).toEqual({
      title: "Tiêu đề tối thiểu 5 ký tự",
      kind: "Hãy chọn loại tin",
      category: "Hãy chọn danh mục",
      place: "Hãy chọn địa điểm",
      date: "Hãy chọn ngày",
      description: "Mô tả tối thiểu 20 ký tự",
      contact: "Số Zalo gồm 10 chữ số, bắt đầu bằng 0",
    });
  });

  it("báo lỗi khi ngày ở tương lai", () => {
    expect(validatePost({ ...validInput, date: "9999-01-01" }).date).toBe(
      "Ngày không được ở tương lai",
    );
  });

  it("báo lỗi khi tiêu đề dưới 5 ký tự sau khi bỏ khoảng trắng hai đầu", () => {
    expect(validatePost({ ...validInput, title: "  ví  " }).title).toBe(
      "Tiêu đề tối thiểu 5 ký tự",
    );
  });

  it("báo lỗi khi tiêu đề trên 80 ký tự", () => {
    expect(validatePost({ ...validInput, title: "a".repeat(81) }).title).toBe(
      "Tiêu đề tối đa 80 ký tự",
    );
  });

  it("báo lỗi khi loại tin nằm ngoài danh sách", () => {
    expect(validatePost({ ...validInput, kind: "Cho mượn" }).kind).toBe(
      "Hãy chọn loại tin",
    );
  });

  it("báo lỗi khi email sai định dạng", () => {
    expect(
      validatePost({ ...validInput, contactType: "Email", contact: "abc" }).contact,
    ).toBe("Email không hợp lệ");
  });

  it("chấp nhận email đúng định dạng", () => {
    expect(
      validatePost({
        ...validInput,
        contactType: "Email",
        contact: "sv01@ptit.edu.vn",
      }),
    ).toEqual({});
  });

  it("báo lỗi khi số điện thoại thiếu chữ số", () => {
    expect(
      validatePost({ ...validInput, contactType: "SĐT", contact: "091234567" }).contact,
    ).toBe("Số điện thoại gồm 10 chữ số, bắt đầu bằng 0");
  });

  it("báo lỗi ở ô thông tin liên hệ khi loại liên hệ lạ", () => {
    expect(validatePost({ ...validInput, contactType: "Khác" }).contact).toBe(
      "Hãy chọn loại liên hệ",
    );
  });
});
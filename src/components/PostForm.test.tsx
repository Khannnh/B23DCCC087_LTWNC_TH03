import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { PostFormState } from "@/lib/post-validate";
import PostForm from "./PostForm";

type Action = (
  prev: PostFormState,
  formData: FormData,
) => Promise<PostFormState>;

describe("Form đăng tin", () => {
  it("hiện lỗi ngay dưới ô tiêu đề khi nhận lỗi từ máy chủ", async () => {
    const user = userEvent.setup();
    const action = vi.fn<Action>().mockResolvedValue({
      errors: { title: "Tiêu đề tối thiểu 5 ký tự" },
      values: {},
    });
    render(<PostForm action={action} />);

    await user.click(screen.getByRole("button", { name: "Đăng tin" }));

    const titleField = screen.getByLabelText("Tiêu đề").parentElement!;
    expect(await within(titleField).findByRole("alert")).toHaveTextContent(
      "Tiêu đề tối thiểu 5 ký tự",
    );
  });

  it("gửi đúng loại tin và thông tin liên hệ khi người dùng điền form", async () => {
    const user = userEvent.setup();
    const action = vi.fn<Action>().mockResolvedValue({
      errors: {},
      values: {},
      ok: true,
    });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText("Tiêu đề"), "Mất tai nghe không dây");
    await user.selectOptions(screen.getByLabelText("Loại tin"), "Thất lạc");
    await user.selectOptions(screen.getByLabelText("Danh mục"), "Khác");
    await user.selectOptions(screen.getByLabelText("Địa điểm"), "Thư viện");
    fireEvent.change(screen.getByLabelText("Ngày"), {
      target: { value: "2020-01-01" },
    });
    await user.type(
      screen.getByLabelText("Mô tả"),
      "Mình làm mất tai nghe ở bàn gần cửa sổ.",
    );
    await user.selectOptions(screen.getByLabelText("Loại liên hệ"), "Email");
    await user.type(screen.getByLabelText("Thông tin liên hệ"), "sv01@ptit.edu.vn");
    await user.click(screen.getByRole("button", { name: "Đăng tin" }));

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const [, formData] = action.mock.calls[0];

    expect(formData.get("kind")).toBe("Thất lạc");
    expect(formData.get("contactType")).toBe("Email");
    expect(formData.get("contact")).toBe("sv01@ptit.edu.vn");
  });

  it("hiện thông báo thiếu quyền và giữ lại tiêu đề đã nhập", async () => {
    const user = userEvent.setup();
    const title = "Mất tai nghe không dây";
    const action = vi.fn<Action>().mockResolvedValue({
      errors: {},
      values: { title },
      message: "Không có quyền",
    });
    render(<PostForm action={action} />);

    await user.type(screen.getByLabelText("Tiêu đề"), title);
    await user.click(screen.getByRole("button", { name: "Đăng tin" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Không có quyền");
    expect(screen.getByLabelText("Tiêu đề")).toHaveValue(title);
  });

  it("chọn Zalo làm loại liên hệ mặc định", () => {
    const action = vi.fn<Action>();
    render(<PostForm action={action} />);

    expect(screen.getByLabelText("Loại liên hệ")).toHaveValue("Zalo");
  });
});
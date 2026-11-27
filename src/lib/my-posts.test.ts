import { beforeEach, describe, expect, it } from "vitest";
import { generatePosts } from "@/data/posts";
import { db } from "./db";
import { listMine, resolvePost, submitPost } from "./my-posts";
import type { PostInput } from "./post-validate";

const sv01 = "sv01@ptit.edu.vn";
const sv02 = "sv02@ptit.edu.vn";

beforeEach(() => {
  db.posts.splice(0, db.posts.length, ...generatePosts(36));
  db.nextPostId = 37;
});

describe("Tin đăng của tôi", () => {
  it("lấy 8 tin đầu trong 27 tin của sinh viên thứ nhất", () => {
    const result = listMine(sv01);

    expect(result.total).toBe(27);
    expect(result.items).toHaveLength(8);
    expect(result.nextCursor).toBe(8);
  });

  it("lấy 3 tin còn lại ở vị trí 24", () => {
    const result = listMine(sv01, undefined, 24);

    expect(result.items).toHaveLength(3);
    expect(result.nextCursor).toBeNull();
  });

  it("lọc được 3 tin chờ duyệt của sinh viên thứ nhất", () => {
    const result = listMine(sv01, "pending");

    expect(result.total).toBe(3);
    expect(result.items).toHaveLength(3);
    expect(result.items.every((post) => post.status === "pending")).toBe(true);
  });

  it("chỉ lấy tin của sinh viên thứ hai", () => {
    const result = listMine(sv02, undefined, 0, 16);

    expect(result.total).toBe(9);
    expect(result.items).toHaveLength(9);
    expect(result.items.every((post) => post.authorEmail === sv02)).toBe(true);
  });

  it("đưa tin mới lên đầu, ghép liên hệ và đặt trạng thái chờ duyệt", () => {
    const input: PostInput = {
      title: "Mất tai nghe không dây",
      kind: "Thất lạc",
      category: "Khác",
      place: "Thư viện",
      date: "2020-01-01",
      description: "Mình làm mất tai nghe ở bàn gần cửa sổ.",
      contactType: "Zalo",
      contact: "0912345678",
    };

    const post = submitPost(sv01, input);

    expect(db.posts[0]).toBe(post);
    expect(post).toMatchObject({
      id: 37,
      authorEmail: sv01,
      status: "pending",
      resolved: false,
      description: `${input.description}\nLiên hệ: Zalo 0912345678`,
    });
  });

  it("báo không tìm thấy khi mã tin không tồn tại", () => {
    expect(resolvePost(sv01, 999)).toBe("not-found");
  });

  it("chặn đánh dấu đã nhận lại tin của người khác", () => {
    expect(resolvePost(sv02, 2)).toBe("forbidden");
  });

  it("chặn đánh dấu đã nhận lại tin chưa được duyệt", () => {
    expect(resolvePost(sv02, 5)).toBe("not-approved");
  });

  it("đánh dấu đã nhận lại cho tin đã duyệt của chính mình", () => {
    expect(resolvePost(sv01, 2)).toBe("ok");
    expect(db.posts.find((post) => post.id === 2)?.resolved).toBe(true);
  });
});
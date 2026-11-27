import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PostForm from "@/components/PostForm";
import { formatDate } from "@/lib/format";
import { listMine, parseStatus } from "@/lib/my-posts";
import { can } from "@/lib/permissions";
import type { PostStatus } from "@/types";
import { createPostAction, resolvePostAction } from "./actions";

export const metadata = {
  robots: { index: false },
};

const statusLabels: Record<PostStatus, string> = {
  pending: "Chờ duyệt",
  approved: "Đang hiển thị",
  hidden: "Đã ẩn",
};

type Props = {
  searchParams: Promise<{
    status?: string | string[];
    limit?: string | string[];
  }>;
};

export default async function MyPostsPage({ searchParams }: Props) {
  const session = await auth();
  const email = session?.user.email;

  if (!email) redirect("/login?callbackUrl=%2Fmy-posts");

  const params = await searchParams;
  const status = parseStatus(params.status);
  const requestedLimit = typeof params.limit === "string" ? Number(params.limit) : 8;
  const limit =
    Number.isSafeInteger(requestedLimit) && requestedLimit > 0
      ? requestedLimit
      : 8;

  const { items, nextCursor, total } = listMine(email, status, 0, limit);
  const mayResolve = can(session?.user.role, "post:resolve");
  const nextQuery = new URLSearchParams({ limit: String(limit + 8) });
  if (status) nextQuery.set("status", status);

  return (
    <main>
      <h1>Tin đăng của tôi</h1>

      <PostForm action={createPostAction} />

      <form action="/my-posts" method="get">
        <label htmlFor="post-status">Trạng thái</label>
        <select id="post-status" name="status" defaultValue={status ?? ""}>
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </select>
        <button type="submit">Lọc</button>
      </form>

      <p>Hiển thị {items.length} / {total} tin</p>

      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {items.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{formatDate(post.date)}</td>
              <td>{post.resolved ? "Đã nhận lại" : statusLabels[post.status]}</td>
              <td>
                {mayResolve && post.status === "approved" && !post.resolved && (
                  <form action={resolvePostAction.bind(null, post.id)}>
                    <button type="submit">Đánh dấu đã nhận lại</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {nextCursor === null ? (
        <p>Đã hiển thị hết tin</p>
      ) : (
        <Link href={`/my-posts?${nextQuery.toString()}`}>Xem thêm</Link>
      )}
    </main>
  );
}
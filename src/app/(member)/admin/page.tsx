import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { moderatePost } from "./actions";

export const metadata = { robots: { index: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user.role, "post:moderate")) redirect("/forbidden");

  const pending = db.posts.filter((post) => post.status === "pending");
  const visible = db.posts.filter(
    (post) => post.status === "approved" && !post.resolved,
  );
  const hidden = db.posts.filter((post) => post.status === "hidden");

  return (
    <main>
      <h1>Kiểm duyệt tin đăng</h1>
      <p>
        Chờ duyệt: {pending.length} | Đang hiển thị: {visible.length} | Đã ẩn:{" "}
        {hidden.length}
      </p>

      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày</th>
            <th>Email người đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{formatDate(post.date)}</td>
              <td>{post.authorEmail}</td>
              <td>
                <form action={moderatePost.bind(null, post.id, "approved")}>
                  <button type="submit">Duyệt</button>
                </form>
                <form action={moderatePost.bind(null, post.id, "hidden")}>
                  <button type="submit">Ẩn</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
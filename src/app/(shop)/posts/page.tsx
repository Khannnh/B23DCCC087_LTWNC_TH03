import Link from "next/link";
import { formatDate } from "@/lib/format";
import { loadPostsShift } from "@/lib/posts";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const kind =
    params.kind === "Thất lạc" || params.kind === "Nhặt được" ? params.kind : "";
  const sort =
    params.sort === "date-desc" || params.sort === "date-asc" ? params.sort : "";

  const posts = await loadPostsShift({ q, kind, sort });
  const renderedAt = new Date().toLocaleTimeString("vi-VN");

  return (
    <main>
      <h1>Tin đăng</h1>

      <form action="/posts" method="get">
        <label htmlFor="q">Tìm kiếm</label>
        <input id="q" name="q" defaultValue={q} />

        <label htmlFor="kind">Loại tin</label>
        <select id="kind" name="kind" defaultValue={kind}>
          <option value="">Tất cả</option>
          <option value="Thất lạc">Thất lạc</option>
          <option value="Nhặt được">Nhặt được</option>
        </select>

        <label htmlFor="sort">Sắp xếp</label>
        <select id="sort" name="sort" defaultValue={sort}>
          <option value="">Mặc định</option>
          <option value="date-desc">Mới nhất</option>
          <option value="date-asc">Cũ nhất</option>
        </select>

        <button type="submit">Lọc</button>
        {(q || kind || sort) && <Link href="/posts">Xóa bộ lọc</Link>}
      </form>

      <p>Có {posts.length} tin đang hiển thị</p>
      <p>Render lúc: {renderedAt}</p>

      {posts.length === 0 ? (
        <p>Không có tin nào phù hợp</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Loại tin</th>
              <th>Địa điểm</th>
              <th>Ngày</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td><Link href={`/posts/${post.id}`}>{post.title}</Link></td>
                <td>{post.kind}</td>
                <td>{post.place}</td>
                <td>{formatDate(post.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
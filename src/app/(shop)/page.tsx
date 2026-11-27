import Link from "next/link";
import { loadPostsShift } from "@/lib/posts";

export default async function HomePage() {
  const posts = await loadPostsShift();

  return (
    <main>
      <h1>PTIT Found – Tìm đồ thất lạc</h1>
      <p>{posts.length} tin đang hiển thị</p>
      <Link href="/posts">Xem tất cả tin</Link>
    </main>
  );
}
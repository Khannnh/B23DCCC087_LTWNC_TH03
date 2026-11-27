import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getPublicPost, loadPostsShift } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 30;

export async function generateStaticParams() {
  const posts = await loadPostsShift();
  return posts.slice(0, 10).map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) notFound();

  const title = `${post.title} – ${post.place}`;
  const description = post.description;

  return { title, description, openGraph: { title, description } };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getPublicPost(Number(id));
  if (!post) notFound();

  const origin = "http://localhost:3000";
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: "Tin đăng", item: `${origin}/posts` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${origin}/posts/${post.id}`,
      },
    ],
  };

  return (
    <main>
      <h1>{post.title}</h1>
      <p>Loại tin: {post.kind}</p>
      <p>Danh mục: {post.category}</p>
      <p>Địa điểm: {post.place}</p>
      <p>Ngày: {formatDate(post.date)}</p>
      <p>Người đăng: {post.authorEmail}</p>
      <p>{post.description}</p>
      <p>Cập nhật lúc: {new Date().toLocaleTimeString("vi-VN")}</p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
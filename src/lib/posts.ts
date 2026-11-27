import { db } from "./db";

type PostFilters = {
  q?: string;
  kind?: string;
  sort?: string;
};

export async function loadPostsShift(
  { q = "", kind, sort }: PostFilters = {},
) {
  await new Promise<void>((resolve) => setTimeout(resolve, 600));
  const keyword = q.trim().toLowerCase();

  const posts = db.posts.filter(
    (post) =>
      post.status === "approved" &&
      !post.resolved &&
      post.title.toLowerCase().includes(keyword) &&
      (!kind || post.kind === kind),
  );

  if (sort === "date-desc") {
    posts.sort((a, b) => b.date.localeCompare(a.date));
  } else if (sort === "date-asc") {
    posts.sort((a, b) => a.date.localeCompare(b.date));
  }

  return posts;
}

export async function getPublicPost(id: number) {
  return db.posts.find(
    (post) => post.id === id && post.status === "approved" && !post.resolved,
  );
}
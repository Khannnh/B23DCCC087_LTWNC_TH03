import type { Post, PostStatus } from "@/types";
import { db } from "./db";
import type { PostInput } from "./post-validate";

export function parseStatus(value: unknown): PostStatus | undefined {
  if (value === "pending" || value === "approved" || value === "hidden") {
    return value;
  }

  return undefined;
}

export function listMine(
  email: string,
  status?: PostStatus | "",
  cursor = 0,
  size = 8,
) {
  const matchingPosts = db.posts.filter(
    (post) => post.authorEmail === email && (!status || post.status === status),
  );
  const items = matchingPosts.slice(cursor, cursor + size);
  const next = cursor + items.length;

  return {
    items,
    nextCursor: next < matchingPosts.length ? next : null,
    total: matchingPosts.length,
  };
}

export function submitPost(email: string, input: PostInput): Post {
  const post: Post = {
    id: db.nextPostId++,
    title: input.title.trim(),
    kind: input.kind as Post["kind"],
    category: input.category as Post["category"],
    place: input.place as Post["place"],
    date: input.date,
    description:
      `${input.description.trim()}\nLiên hệ: ${input.contactType} ${input.contact.trim()}`,
    authorEmail: email,
    status: "pending",
    resolved: false,
  };

  db.posts.unshift(post);
  return post;
}

export function resolvePost(email: string, id: number) {
  const post = db.posts.find((item) => item.id === id);

  if (!post) return "not-found";
  if (post.authorEmail !== email) return "forbidden";
  if (post.status !== "approved") return "not-approved";

  post.resolved = true;
  return "ok";
}
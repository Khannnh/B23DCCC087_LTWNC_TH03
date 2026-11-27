"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { resolvePost, submitPost } from "@/lib/my-posts";
import { can } from "@/lib/permissions";
import { toPostInput, validatePost } from "@/lib/post-validate";
import type { PostFormState } from "@/lib/post-validate";

export async function createPostAction(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const values = toPostInput(formData);
  const session = await auth();
  const email = session?.user.email;

  if (!email || !can(session?.user.role, "post:create")) {
    return { errors: {}, values, message: "Không có quyền" };
  }

  const errors = validatePost(values);
  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  submitPost(email, values);
  revalidatePath("/my-posts");

  return {
    errors: {},
    values: {},
    message: "Đã gửi tin, chờ kiểm duyệt",
    ok: true,
  };
}

export async function resolvePostAction(id: number): Promise<void> {
  const session = await auth();
  const email = session?.user.email;

  if (!email || !can(session?.user.role, "post:resolve")) {
    throw new Error("Không có quyền");
  }

  if (resolvePost(email, id) !== "ok") return;

  revalidatePath("/my-posts");
  revalidatePath("/posts");
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
}
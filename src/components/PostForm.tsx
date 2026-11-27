"use client";

import { useActionState } from "react";
import { CATEGORIES, KINDS, PLACES } from "@/data/posts";
import type { PostFormState } from "@/lib/post-validate";

type Props = {
  action: (prev: PostFormState, formData: FormData) => Promise<PostFormState>;
};

const initialState: PostFormState = { errors: {}, values: {} };

export default function PostForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const { errors, values, message, ok } = state;

  return (
    <form action={formAction} key={JSON.stringify(values)}>
      <div>
        <label htmlFor="post-title">Tiêu đề</label>
        <input id="post-title" name="title" defaultValue={values.title ?? ""} />
        {errors.title && <p role="alert">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="post-kind">Loại tin</label>
        <select id="post-kind" name="kind" defaultValue={values.kind ?? ""}>
          <option value="">-- Chọn --</option>
          {KINDS.map((kind) => (
            <option key={kind} value={kind}>{kind}</option>
          ))}
        </select>
        {errors.kind && <p role="alert">{errors.kind}</p>}
      </div>

      <div>
        <label htmlFor="post-category">Danh mục</label>
        <select
          id="post-category"
          name="category"
          defaultValue={values.category ?? ""}
        >
          <option value="">-- Chọn --</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        {errors.category && <p role="alert">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="post-place">Địa điểm</label>
        <select id="post-place" name="place" defaultValue={values.place ?? ""}>
          <option value="">-- Chọn --</option>
          {PLACES.map((place) => (
            <option key={place} value={place}>{place}</option>
          ))}
        </select>
        {errors.place && <p role="alert">{errors.place}</p>}
      </div>

      <div>
        <label htmlFor="post-date">Ngày</label>
        <input id="post-date" name="date" type="date" defaultValue={values.date ?? ""} />
        {errors.date && <p role="alert">{errors.date}</p>}
      </div>

      <div>
        <label htmlFor="post-description">Mô tả</label>
        <textarea
          id="post-description"
          name="description"
          defaultValue={values.description ?? ""}
        />
        {errors.description && <p role="alert">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="post-contact-type">Loại liên hệ</label>
        <select
          id="post-contact-type"
          name="contactType"
          defaultValue={values.contactType ?? "Zalo"}
        >
          <option value="Zalo">Zalo</option>
          <option value="SĐT">SĐT</option>
          <option value="Email">Email</option>
        </select>
      </div>

      <div>
        <label htmlFor="post-contact">Thông tin liên hệ</label>
        <input id="post-contact" name="contact" defaultValue={values.contact ?? ""} />
        {errors.contact && <p role="alert">{errors.contact}</p>}
      </div>

      <button type="submit" disabled={isPending}>Đăng tin</button>
      {message && <p role={ok ? "status" : "alert"}>{message}</p>}
    </form>
  );
}
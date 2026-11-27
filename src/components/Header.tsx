"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <nav>
      <Link href="/">Trang chủ</Link>{" · "}
      <Link href="/posts">Tin đăng</Link>

      {status === "unauthenticated" && (
        <>{" · "}<Link href="/login">Đăng nhập</Link></>
      )}

      {session && (
        <>
          {" · "}
          <span>Xin chào, {session.user.name} ({session.user.role})</span>
          {" · "}
          <Link href="/my-posts">Tin của tôi</Link>
          {session.user.role === "admin" && (
            <>{" · "}<Link href="/admin">Quản trị</Link></>
          )}
          {" "}
          <button type="button" onClick={() => signOut({ redirectTo: "/" })}>
            Đăng xuất
          </button>
        </>
      )}
    </nav>
  );
}
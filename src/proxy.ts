import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { can } from "@/lib/permissions";

export default auth((request) => {
  const { pathname, search } = request.nextUrl;

  if (!request.auth?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminPage && !can(request.auth.user.role, "post:moderate")) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/my-posts/:path*", "/admin/:path*"],
};
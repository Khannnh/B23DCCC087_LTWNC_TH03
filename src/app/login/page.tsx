import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

async function login(formData: FormData) {
  "use server";

  const callback = formData.get("callbackUrl");
  const redirectTo =
    typeof callback === "string" &&
    /^\/(?:admin|my-posts)(?:\/|\?|$)/.test(callback)
      ? callback
      : "/my-posts";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect(
        `/login?error=credentials&callbackUrl=${encodeURIComponent(redirectTo)}`,
      );
    }

    throw error;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string | string[];
  }>;
}) {
  const { error, callbackUrl } = await searchParams;

  return (
    <main>
      <h1>Đăng nhập</h1>

      <form action={login}>
        <input
          type="hidden"
          name="callbackUrl"
          value={typeof callbackUrl === "string" ? callbackUrl : ""}
        />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" />

        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
        />

        <button type="submit">Đăng nhập</button>
      </form>

      {error === "credentials" && (
        <p role="alert">Email hoặc mật khẩu không đúng</p>
      )}
    </main>
  );
}
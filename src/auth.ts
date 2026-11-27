import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { USERS } from "@/data/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      authorize(credentials) {
        const { email, password } = credentials;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = USERS.find(
          (item) =>
            item.email === email.trim().toLowerCase() &&
            item.password === password,
        );

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      const role = token.role;
      if (role === "member" || role === "admin") {
        session.user.role = role;
      }
      return session;
    },
  },
});
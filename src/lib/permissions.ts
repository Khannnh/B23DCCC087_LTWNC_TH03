import type { Role } from "@/types";

export type Action = "post:view" | "post:create" | "post:resolve" | "post:moderate";

export function can(role: Role | undefined, action: Action): boolean {
  switch (action) {
    case "post:view":
      return true;
    case "post:create":
    case "post:resolve":
      return role === "member";
    case "post:moderate":
      return role === "admin";
  }
}
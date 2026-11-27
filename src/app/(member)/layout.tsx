import type { ReactNode } from "react";

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <p>Khu vực thành viên</p>
      {children}
    </section>
  );
}
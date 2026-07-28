"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SidebarLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-[var(--color-ink-900)] text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          : "text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

"use client";

import { Menu } from "lucide-react";
import { useMobileMenuStore } from "@/store/mobile-menu-store";

export function MobileMenuButton() {
  const toggle = useMobileMenuStore((s) => s.toggle);

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--foreground)] transition hover:border-[var(--accent)] lg:hidden"
      aria-label="Abrir menú"
    >
      <Menu size={17} />
    </button>
  );
}

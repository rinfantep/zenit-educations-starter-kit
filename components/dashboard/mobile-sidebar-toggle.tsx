"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useMobileMenuStore } from "@/store/mobile-menu-store";

export function MobileSidebarDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const open = useMobileMenuStore((s) => s.open);
  const setOpen = useMobileMenuStore((s) => s.setOpen);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--surface)]">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--foreground)]"
        >
          <X size={16} />
        </button>
        {children}
      </aside>
    </div>
  );
}

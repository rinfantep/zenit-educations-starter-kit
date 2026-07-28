"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDown, LogOut, Settings } from "lucide-react";

export function UserMenu({ name, role }: { name: string; role: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-[var(--background)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-xs font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
          {initials}
        </div>
        <ChevronDown size={14} className="text-[var(--text-muted)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-48 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] py-1.5 shadow-lg">
          <div className="border-b border-[var(--border-subtle)] px-3.5 py-2.5">
            <p className="text-sm font-medium text-[var(--foreground)]">
              {name}
            </p>
            <p className="text-xs text-[var(--text-muted)]">{role}</p>
          </div>

          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
          >
            <Settings size={14} />
            Mi cuenta
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

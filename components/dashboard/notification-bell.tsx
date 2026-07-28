import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell({ count }: { count: number }) {
  return (
    <Link
      href="/comunicacion"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--foreground)] transition hover:border-[var(--accent)]"
    >
      <Bell size={16} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

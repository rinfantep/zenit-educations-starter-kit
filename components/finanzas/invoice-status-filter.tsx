"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendientes" },
  { value: "PAID", label: "Pagadas" },
  { value: "OVERDUE", label: "Vencidas" },
];

export function InvoiceStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "ALL";

  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1 sm:flex sm:w-fit">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("status", o.value);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className={`rounded-md px-3 py-1.5 text-xs transition ${
            current === o.value
              ? "bg-[var(--background)] text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

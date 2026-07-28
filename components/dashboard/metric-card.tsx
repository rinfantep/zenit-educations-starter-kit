import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)]">
          <Icon size={15} className="text-[var(--accent)]" />
        </div>
      </div>
      <p className="mt-3 font-display text-3xl text-[var(--foreground)]">
        {value}
      </p>
      {trend && (
        <p className="mt-1 text-xs text-[var(--text-muted)]">{trend}</p>
      )}
    </div>
  );
}

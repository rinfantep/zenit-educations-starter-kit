"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { deleteScheduleSlotAction } from "@/app/(app)/clases/[id]/horario/actions";

type Slot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  classroom: string | null;
};

const dayLabels: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
};

export function ScheduleGrid({
  classId,
  slots,
}: {
  classId: string;
  slots: Slot[];
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteScheduleSlotAction(id, classId);
      toast.success("Bloque eliminado");
    });
  }

  const byDay = Object.fromEntries(
    [1, 2, 3, 4, 5].map((d) => [d, slots.filter((s) => s.dayOfWeek === d)]),
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[1, 2, 3, 4, 5].map((day) => (
        <div
          key={day}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4"
        >
          <h3 className="font-display text-sm text-[var(--foreground)]">
            {dayLabels[day]}
          </h3>
          <div className="mt-3 space-y-2">
            {byDay[day].length === 0 && (
              <p className="text-xs text-[var(--text-muted)]">Sin clases</p>
            )}
            {byDay[day].map((slot) => (
              <div
                key={slot.id}
                className="rounded-lg border border-[var(--border-subtle)] p-2.5"
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-medium text-[var(--accent)]">
                    {slot.startTime} - {slot.endTime}
                  </p>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    disabled={isPending}
                    className="text-[var(--text-muted)] hover:text-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
                <p className="mt-1 text-sm text-[var(--foreground)]">
                  {slot.subject}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {slot.teacher}
                </p>
                {slot.classroom && (
                  <p className="text-xs text-[var(--text-muted)]">
                    {slot.classroom}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

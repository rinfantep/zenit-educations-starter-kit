"use client";

import { useState } from "react";
import {
  User,
  FileText,
  ClipboardCheck,
  Wallet,
  Folder,
  Users2,
} from "lucide-react";
import { EditStudentForm } from "./edit-student-form";
import { DocumentUpload } from "./document-upload";
import { ParentsPanel } from "./parents-panel";

type Evaluation = {
  id: string;
  subject: string;
  period: string;
  type: string;
  score: number;
  maxScore: number;
};
type DocumentItem = {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
};
type InvoiceItem = {
  id: string;
  concept: string;
  amount: number;
  status: string;
  dueDate: string;
  paid: number;
};
type ParentItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

type TabType =
  | "data"
  | "documents"
  | "academic"
  | "attendance"
  | "finance"
  | "parents";

export function StudentProfileTabs({
  studentId,
  editableData,
  classes,
  documents,
  evaluations,
  attendanceStats,
  invoices,
  parents,
}: {
  studentId: string;
  editableData: {
    name: string;
    phone: string;
    address: string;
    classId: string;
  };
  classes: { id: string; display: string }[];
  documents: DocumentItem[];
  evaluations: Evaluation[];
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  invoices: InvoiceItem[];
  parents: ParentItem[];
}) {
  const [tab, setTab] = useState<TabType>("data");

  const tabs = [
    { id: "data" as const, label: "Datos", icon: User },
    { id: "documents" as const, label: "Documentos", icon: Folder },
    { id: "academic" as const, label: "Académico", icon: FileText },
    { id: "attendance" as const, label: "Asistencia", icon: ClipboardCheck },
    { id: "finance" as const, label: "Finanzas", icon: Wallet },
    { id: "parents" as const, label: "Padres/Tutores", icon: Users2 },
  ];

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-2 text-sm transition ${
                tab === t.id
                  ? "bg-[var(--background)] text-[var(--foreground)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {tab === "data" && (
          <EditStudentForm
            studentId={studentId}
            data={editableData}
            classes={classes}
          />
        )}

        {tab === "documents" && (
          <DocumentUpload studentId={studentId} documents={documents} />
        )}

        {tab === "academic" && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
            <h3 className="font-display text-base text-[var(--foreground)]">
              Historial de calificaciones
            </h3>
            {evaluations.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Sin registros todavía.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-[var(--border-subtle)]">
                {evaluations.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {e.subject}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {e.type} · {e.period}
                      </p>
                    </div>
                    <span className="font-medium text-[var(--foreground)]">
                      {e.score}/{e.maxScore}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "attendance" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-center">
              <p className="font-display text-2xl text-emerald-500">
                {attendanceStats.present}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Presente</p>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-center">
              <p className="font-display text-2xl text-red-500">
                {attendanceStats.absent}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Ausente</p>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-center">
              <p className="font-display text-2xl text-amber-500">
                {attendanceStats.late}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Tarde</p>
            </div>
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4 text-center">
              <p className="font-display text-2xl text-[var(--accent)]">
                {attendanceStats.total > 0
                  ? Math.round(
                      (attendanceStats.present / attendanceStats.total) * 100,
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-[var(--text-muted)]">Asistencia</p>
            </div>
          </div>
        )}

        {tab === "finance" && (
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
            <h3 className="font-display text-base text-[var(--foreground)]">
              Facturas
            </h3>
            {invoices.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Sin facturas registradas.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-[var(--border-subtle)]">
                {invoices.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between py-2.5 text-sm"
                  >
                    <div>
                      <p className="font-medium text-[var(--foreground)]">
                        {i.concept}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Vence {i.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--foreground)]">
                        ${i.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {i.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "parents" && (
          <ParentsPanel studentId={studentId} parents={parents} />
        )}
      </div>
    </div>
  );
}

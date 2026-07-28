"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { FileUp, FileText, Trash2 } from "lucide-react";
import { addStudentDocumentAction } from "@/app/(app)/estudiantes/[id]/actions";

type DocumentItem = { id: string; name: string; type: string; url: string; uploadedAt: string };

const docTypes = [
  { value: "cedula", label: "Cédula / DNI" },
  { value: "certificado_nacimiento", label: "Certificado de nacimiento" },
  { value: "boletin_anterior", label: "Boletín anterior" },
  { value: "certificado_medico", label: "Certificado médico" },
  { value: "otro", label: "Otro" },
];

export function DocumentUpload({
  studentId,
  documents,
}: {
  studentId: string;
  documents: DocumentItem[];
}) {
  const [selectedType, setSelectedType] = useState("cedula");
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <h3 className="font-display text-base text-[var(--foreground)]">Documentos</h3>

      {!preset ? (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          La subida de archivos requiere configurar Cloudinary en las variables de entorno.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            {docTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>

          <CldUploadWidget
            uploadPreset={preset}
            options={{ multiple: false, maxFiles: 1, resourceType: "auto" }}
            onSuccess={async (result) => {
              if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                const info = result.info as { secure_url: string; original_filename?: string };
                await addStudentDocumentAction(
                  studentId,
                  info.original_filename ?? "Documento",
                  selectedType,
                  info.secure_url
                );
                toast.success("Documento subido correctamente");
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-900)] px-3.5 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
              >
                <FileUp size={14} />
                Subir archivo
              </button>
            )}
          </CldUploadWidget>
        </div>
      )}

      <div className="mt-4 divide-y divide-[var(--border-subtle)]">
        {documents.length === 0 && (
          <p className="py-3 text-sm text-[var(--text-muted)]">No hay documentos cargados todavía.</p>
        )}
        {documents.map((d) => (
          <div key={d.id} className="flex items-center justify-between py-2.5">
            
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-[var(--foreground)] hover:text-[var(--accent)]"
            <a>
              <FileText size={15} className="text-[var(--text-muted)]" />
              <div>
                <p>{d.name}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {docTypes.find((t) => t.value === d.type)?.label ?? d.type} · {d.uploadedAt}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
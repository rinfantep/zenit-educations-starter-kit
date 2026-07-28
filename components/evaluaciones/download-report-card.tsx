"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { generateReportCardPdf } from "@/lib/generate-report-card-pdf";

export function DownloadReportCard({
  studentId,
  periodId,
}: {
  studentId: string;
  periodId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/report-card?studentId=${studentId}&periodId=${periodId}`,
      );
      const data = await res.json();
      if (data) generateReportCardPdf(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-60"
    >
      <FileDown size={13} />
      {loading ? "Generando..." : "Boletín PDF"}
    </button>
  );
}

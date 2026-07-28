import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type ReportCardData = Awaited<
  ReturnType<typeof import("./report-card").getReportCardData>
>;

export function generateReportCardPdf(data: NonNullable<ReportCardData>) {
  const doc = new jsPDF();

  // Encabezado institucional
  doc.setFillColor(16, 25, 46); // ink-900
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(247, 246, 242); // paper-50
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Zenith Education", 15, 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Boletín de calificaciones", 15, 23);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(data.studentName, 15, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Código: ${data.studentCode}`, 15, 50);
  doc.text(`Clase: ${data.className}`, 15, 55);
  doc.text(`Período: ${data.periodName} (${data.year})`, 15, 60);

  // Tabla de materias
  autoTable(doc, {
    startY: 68,
    head: [["Materia", "Evaluaciones", "Promedio"]],
    body: data.subjects.map((s) => [
      s.name,
      s.entries.map((e) => `${e.type}: ${e.score}/${e.maxScore}`).join(", "),
      `${s.average}`,
    ]),
    headStyles: { fillColor: [16, 25, 46], textColor: 255 },
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: { 2: { halign: "center", fontStyle: "bold" } },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  doc.setFillColor(184, 145, 47); // gold-500
  doc.roundedRect(140, finalY + 8, 55, 18, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Promedio general", 145, finalY + 15);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.overallAverage}`, 145, finalY + 22);

  doc.setTextColor(140, 140, 140);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generado el ${new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}`,
    15,
    285,
  );

  doc.save(
    `boletin-${data.studentCode}-${data.periodName.replace(/\s+/g, "-")}.pdf`,
  );
}

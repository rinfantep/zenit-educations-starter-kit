import { NextRequest, NextResponse } from "next/server";
import { getReportCardData } from "@/lib/report-card";

export async function GET(req: NextRequest) {
  const studentId = req.nextUrl.searchParams.get("studentId");
  const periodId = req.nextUrl.searchParams.get("periodId");

  if (!studentId || !periodId) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const data = await getReportCardData(studentId, periodId);
  if (!data) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(data);
}

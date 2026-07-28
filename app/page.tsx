// app/page.tsx
import Link from "next/link";
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  Wallet,
  FileText,
  MessageSquare,
  Check,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Estudiantes y Profesores",
    desc: "Perfiles completos, documentos, historial académico.",
  },
  {
    icon: ClipboardCheck,
    title: "Asistencia diaria",
    desc: "Control por clase con reportes y estadísticas en tiempo real.",
  },
  {
    icon: FileText,
    title: "Evaluaciones y boletines",
    desc: "Notas por período con boletines PDF generados al instante.",
  },
  {
    icon: Wallet,
    title: "Finanzas",
    desc: "Matrículas, facturas, pagos manuales y Stripe Checkout.",
  },
  {
    icon: MessageSquare,
    title: "Comunicación",
    desc: "Avisos institucionales y mensajería directa entre roles.",
  },
  {
    icon: GraduationCap,
    title: "5 roles distintos",
    desc: "Super Admin, Director, Profesor, Estudiante y Padre/Madre.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ink-950)] text-[var(--color-paper-50)]">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <GraduationCap size={22} className="text-[var(--color-gold-300)]" />
          <span className="font-display text-lg">Zenith</span>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-[var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[var(--color-ink-950)] transition hover:bg-[var(--color-gold-300)]"
        >
          Ver demo en vivo
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl leading-tight sm:text-5xl">
          Gestión escolar completa,{" "}
          <span className="italic text-[var(--color-gold-300)]">
            sin fricción
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[var(--color-slate-400)]">
          Estudiantes, profesores, asistencia, evaluaciones, finanzas y
          comunicación en una sola plataforma. Construido con Next.js, listo
          para producción.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-[var(--color-gold-500)] px-6 py-3 text-sm font-medium text-[var(--color-ink-950)] transition hover:bg-[var(--color-gold-300)]"
          >
            Probar demo ahora
          </Link>
        </div>
      </section>

      {/* Demo credentials banner */}
      <section className="mx-auto max-w-2xl px-6 pb-16">
        <div className="rounded-xl border border-[var(--color-gold-500)]/30 bg-[var(--color-ink-900)] p-6">
          <p className="text-center text-sm font-medium text-[var(--color-gold-300)]">
            Credenciales de acceso al demo (entorno público, se reinicia
            periódicamente)
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { role: "Super Admin", email: "admin@zenith.edu" },
              { role: "Director", email: "director@zenith.edu" },
              { role: "Profesor", email: "profesor1@zenith.edu" },
              { role: "Estudiante", email: "estudiante1@zenith.edu" },
            ].map((c) => (
              <div
                key={c.email}
                className="rounded-lg bg-[var(--color-ink-950)] p-3 text-xs"
              >
                <p className="text-[var(--color-slate-400)]">{c.role}</p>
                <p className="mt-1 font-mono text-[var(--color-paper-50)]">
                  {c.email}
                </p>
                <p className="font-mono text-[var(--color-gold-300)]">
                  Zenith2026!
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
            >
              <f.icon size={18} className="text-[var(--color-gold-300)]" />
              <h3 className="mt-3 font-display text-base">{f.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--color-slate-400)]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-[var(--color-slate-400)]">
        Zenith Education — Sistema de gestión escolar
      </footer>
    </div>
  );
}

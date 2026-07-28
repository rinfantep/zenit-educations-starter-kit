"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel izquierdo — signature element */}
      <div className="relative hidden overflow-hidden bg-[var(--color-ink-950)] lg:flex lg:flex-col lg:justify-between p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-gold-300) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-gold-500)]">
            <GraduationCap size={20} className="text-[var(--color-gold-300)]" />
          </div>
          <span className="font-display text-xl text-[var(--color-paper-50)]">
            Zenith
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-4xl italic leading-tight text-[var(--color-paper-50)]">
            "La excelencia académica no se improvisa, se administra."
          </p>
          <p className="mt-6 text-sm text-[var(--color-slate-400)]">
            Sistema integral de gestión escolar — matrícula, asistencia,
            evaluaciones y finanzas en una sola plataforma.
          </p>
        </div>

        <div className="relative text-xs text-[var(--color-slate-400)]">
          © {new Date().getFullYear()} Zenith Education
        </div>
      </div>

      {/* Panel derecho — form */}
      <div className="flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-20">
        <div className="mb-10 flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap size={22} className="text-[var(--accent)]" />
            <span className="font-display text-lg">Zenith</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl text-[var(--foreground)]">
            Bienvenido de nuevo
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Ingresá tus credenciales para acceder a tu panel.
          </p>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@zenith.edu"
                className="mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-[var(--foreground)]"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
            >
              {pending ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

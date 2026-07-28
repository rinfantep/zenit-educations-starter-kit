import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const protectedPaths = [
        "/dashboard",
        "/estudiantes",
        "/profesores",
        "/clases",
        "/asistencia",
        "/evaluaciones",
        "/finanzas",
        "/comunicacion",
      ];
      const isProtected = protectedPaths.some((p) => path.startsWith(p));

      if (isProtected) return isLoggedIn;
      if (isLoggedIn && path === "/login") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // se definen en auth.ts (necesitan Node runtime, no edge)
} satisfies NextAuthConfig;

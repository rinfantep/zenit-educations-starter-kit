# Zenith Education — School Management System

Sistema integral de gestión escolar construido con Next.js 16, TypeScript, Prisma y PostgreSQL. Listo para producción, con integraciones opcionales de pagos, almacenamiento y email.

**[Ver demo en vivo →](TU_URL_DE_VERCEL_AQUI)**

## Capturas

<!-- Agregá acá 4-6 screenshots: dashboard, perfil de estudiante, boletín PDF, finanzas, modo oscuro -->

## Módulos incluidos

- **Administración** — autenticación con 5 roles (Super Admin, Director, Profesor, Estudiante, Padre/Madre), cambio y recuperación de contraseña
- **Estudiantes** — perfil completo, documentos, fotos, historial académico, vinculación de padres/tutores
- **Profesores** — gestión docente, materias, clases a cargo
- **Clases** — grados, materias, aulas, horarios semanales con detección de choques de profesor
- **Asistencia** — control diario por clase, estadísticas
- **Evaluaciones** — notas por materia/período, boletines en PDF
- **Finanzas** — matrículas, facturas, pagos manuales y Stripe Checkout opcional
- **Comunicación** — avisos institucionales, notificaciones, mensajería directa
- **Auditoría** — registro de acciones sensibles (altas, bajas, pagos) con usuario y fecha

## Roles y qué ve cada uno

| Rol | Acceso |
|---|---|
| Super Admin | Todo el sistema, incluida Auditoría y Configuración |
| Director | Todo excepto Auditoría de sistema (configurable) |
| Profesor | Sus clases, asistencia, evaluaciones, comunicación |
| Estudiante | Su propia asistencia, notas, comunicación |
| Padre/Madre | Panel de solo lectura con el progreso de sus hijos vinculados |

## Stack técnico

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- Auth.js v5 (NextAuth)
- Zustand (estado del cliente)
- Recharts (gráficos)
- jsPDF (boletines)
- Sonner (notificaciones)
- Cloudinary (fotos y documentos — opcional)
- Stripe (pagos online — opcional)
- Resend (emails — opcional)

Totalmente responsive (mobile, tablet, desktop) con modo claro/oscuro.

## Requisitos previos

- Node.js 20+
- pnpm
- PostgreSQL 14+ (local o en la nube — recomendamos [Neon](https://neon.tech) o [Supabase](https://supabase.com))

## Instalación

1. Instalá dependencias:

   \`\`\`bash
   pnpm install
   \`\`\`

2. Copiá las variables de entorno:

   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Completá `DATABASE_URL` con tu conexión de PostgreSQL.

4. Generá el secreto de autenticación:

   \`\`\`bash
   pnpm dlx auth secret
   \`\`\`

5. Corré las migraciones y generá el cliente:

   \`\`\`bash
   pnpm dlx prisma migrate deploy
   pnpm dlx prisma generate
   \`\`\`

6. Cargá datos de demostración (recomendado):

   \`\`\`bash
   pnpm dlx prisma db seed
   \`\`\`

   Crea ~10 profesores, ~60 estudiantes, clases, horarios, asistencia, notas y facturas de ejemplo.

7. Iniciá el servidor:

   \`\`\`bash
   pnpm dev
   \`\`\`

8. Entrá a `http://localhost:3000`.

## Credenciales de demostración (después del seed)

| Rol | Email | Contraseña |
|---|---|---|
| Super Admin | admin@zenith.edu | Zenith2026! |
| Director | director@zenith.edu | Zenith2026! |
| Profesor | profesor1@zenith.edu | Zenith2026! |
| Estudiante | estudiante1@zenith.edu | Zenith2026! |

**Importante:** cambiá estas contraseñas antes de usar el sistema en producción real (desde "Mi cuenta" → Cambiar contraseña).

## Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Requerida | Propósito |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión a PostgreSQL |
| `AUTH_SECRET` | Sí | Firma de sesiones (Auth.js) |
| `NEXT_PUBLIC_APP_URL` | Sí | URL pública de la app (para links de email y Stripe) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | No | Pagos online |
| `RESEND_API_KEY` | No | Emails de recuperación de contraseña |
| `CLOUDINARY_*` | No | Fotos y documentos |
| `DEMO_RESET_SECRET` | No | Protege el endpoint de reseteo de datos demo |

Cada integración opcional se desactiva sola (con un fallback visual apropiado) si su variable no está configurada — el sistema nunca se rompe por falta de una API key de terceros.

## Integraciones opcionales

- **Cloudinary**: cuenta gratis en cloudinary.com → copiá las 5 claves → creá un upload preset sin firma (`Settings → Upload → Add upload preset → Signing mode: Unsigned`).
- **Stripe**: cuenta en stripe.com → copiá tu Secret key → configurá un webhook a `/api/webhooks/stripe` con el evento `checkout.session.completed`.
- **Resend**: cuenta gratis en resend.com → copiá tu API key. Sin esto, los links de reset de contraseña se imprimen en la consola del servidor.

## Despliegue en producción

1. Creá una base de datos en Neon/Supabase.
2. Subí el proyecto a GitHub.
3. Importá el repo en Vercel.
4. Configurá las variables de entorno en Vercel (Settings → Environment Variables).
5. Build Command: `pnpm dlx prisma migrate deploy && pnpm build`.
6. Deploy, y corré el seed contra la DB de producción si querés datos de ejemplo ahí también.

### Demo público auto-resetable (opcional)

El proyecto incluye un endpoint `/api/demo-reset` que borra y regenera los datos de demostración, protegido por `DEMO_RESET_SECRET`. Configurando `vercel.json` con un cron job, podés tener un demo público que se limpia solo cada tantas horas — ideal para mostrar el sistema sin arriesgar que alguien lo deje en mal estado. Ver `vercel.json` para el schedule configurado.

## Estructura del proyecto

\`\`\`
app/
  page.tsx          → landing page pública
  (auth)/           → login, forgot-password, reset-password
  (app)/            → rutas protegidas (dashboard, estudiantes, clases, etc.)
  api/              → auth, checkout, webhooks, report-card, demo-reset
components/         → UI organizada por módulo
lib/                → queries de Prisma, utilidades, clientes de integraciones
store/              → estado de Zustand (vistas, menú mobile)
prisma/
  schema.prisma     → modelo de datos completo
  seed.ts           → punto de entrada del seed (usa lib/seed-demo-data.ts)
\`\`\`

## Licencia

## Licencia

Licencia de uso único, estilo MIT.

Al comprar este producto, se otorga una licencia no exclusiva para:
- Usar, modificar y desplegar este código en **un (1)** proyecto propio o de un cliente final.
- Modificar el código libremente para adaptarlo a tus necesidades.

No incluye:
- Reventa o redistribución del código fuente tal cual, como plantilla, starter kit o producto digital.
- Uso en múltiples proyectos bajo una misma compra.

Para licencias de uso múltiple o consultas sobre términos extendidos,
contactar directamente antes de la compra.

Este software se entrega "tal cual" (as-is), sin garantías explícitas de
funcionamiento en entornos específicos del comprador.

## Soporte

Este es un starter kit comercial. Para dudas de instalación o personalización: [rinfantep92@gmail.com].

user
admin@zenith.edu
director@zenith.edu

pass
Zenith2026!
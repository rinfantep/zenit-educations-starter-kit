# Zenith Education — School Management System

A complete school management system built with Next.js 16, TypeScript, Prisma, and PostgreSQL. Production-ready, with optional integrations for payments, file storage, and email.

**[View live demo →](https://zenit-educations-starter-kit.vercel.app/)**

## Screenshots

<!-- Add 4-6 screenshots here: dashboard, student profile, PDF report card, finance page, dark mode -->

## Modules included

- **Administration** — authentication with 5 roles (Super Admin, Director, Teacher, Student, Parent), password change and recovery
- **Students** — full profile, documents, photos, academic history, parent/guardian linking
- **Teachers** — staff management, subjects, assigned classes
- **Classes** — grades, subjects, classrooms, weekly schedules with teacher time-conflict detection
- **Attendance** — daily tracking per class, statistics
- **Evaluations** — grades by subject/period, PDF report cards
- **Finance** — tuition, invoices, manual payments and optional Stripe Checkout
- **Communication** — school-wide announcements, notifications, direct messaging
- **Audit log** — tracks sensitive actions (creations, deletions, payments) with user and timestamp

## Roles and permissions

| Role | Access |
|---|---|
| Super Admin | Full system access, including Audit Log and Settings |
| Director | Full access except system Audit Log (configurable) |
| Teacher | Their classes, attendance, evaluations, communication |
| Student | Their own attendance, grades, communication |
| Parent | Read-only dashboard showing their linked children's progress |

## Tech stack

- Next.js 16 (App Router, Server Actions)
- TypeScript
- Tailwind CSS v4
- Prisma ORM + PostgreSQL
- Auth.js v5 (NextAuth)
- Zustand (client state)
- Recharts (charts)
- jsPDF (report cards)
- Sonner (toast notifications)
- Cloudinary (photos and documents — optional)
- Stripe (online payments — optional)
- Resend (emails — optional)

Fully responsive (mobile, tablet, desktop) with light/dark mode.

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 14+ (local or cloud — we recommend [Neon](https://neon.tech) or [Supabase](https://supabase.com))

## Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment variables file:

   ```bash
   cp .env.example .env
   ```

3. Set `DATABASE_URL` in `.env` to your PostgreSQL connection string.

4. Generate the auth secret:

   ```bash
   pnpm dlx auth secret
   ```

5. Run migrations and generate the Prisma client:

   ```bash
   pnpm dlx prisma migrate deploy
   pnpm dlx prisma generate
   ```

6. Seed demo data (recommended):

   ```bash
   pnpm dlx prisma db seed
   ```

   This creates ~10 teachers, ~60 students, classes, schedules, attendance, grades, and sample invoices.

7. Start the dev server:

   ```bash
   pnpm dev
   ```

8. Go to `http://localhost:3000`.

## Demo credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@zenith.edu | Zenith2026! |
| Director | director@zenith.edu | Zenith2026! |
| Teacher | profesor1@zenith.edu | Zenith2026! |
| Student | estudiante1@zenith.edu | Zenith2026! |

**Important:** change these passwords before using the system in a real production environment (via "My account" → Change password).

## Environment variables

See `.env.example` for the full list. Summary:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection |
| `AUTH_SECRET` | Yes | Session signing (Auth.js) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (used in emails and Stripe redirects) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | No | Online payments |
| `RESEND_API_KEY` | No | Password reset emails |
| `CLOUDINARY_*` | No | Photos and documents |
| `DEMO_RESET_SECRET` | No | Protects the demo data reset endpoint |

Every optional integration disables itself gracefully (with an appropriate UI fallback) when its variable isn't set — the system never breaks due to a missing third-party API key.

## Optional integrations

- **Cloudinary**: create a free account at cloudinary.com → copy the 5 keys → create an unsigned upload preset (`Settings → Upload → Add upload preset → Signing mode: Unsigned`).
- **Stripe**: create an account at stripe.com → copy your Secret key → set up a webhook pointing to `/api/webhooks/stripe` for the `checkout.session.completed` event.
- **Resend**: create a free account at resend.com and copy your API key. Without it, password reset links are printed to the server console instead.

## Production deployment

1. Create a database on Neon/Supabase.
2. Push the project to GitHub.
3. Import the repo into Vercel.
4. Set the environment variables in Vercel (Settings → Environment Variables).
5. Build Command: `pnpm dlx prisma migrate deploy && pnpm build`.
6. Deploy, and optionally run the seed against your production database for sample data.

### Self-resetting public demo (optional)

The project includes a `/api/demo-reset` endpoint that wipes and regenerates demo data, protected by `DEMO_RESET_SECRET`. Combined with a `vercel.json` cron job, this lets you run a public demo that cleans itself up automatically every few hours — ideal for showcasing the system without risking someone leaving it in a broken state. See `vercel.json` for the configured schedule.

## Project structure

```
app/
  page.tsx          → public landing page
  (auth)/           → login, forgot-password, reset-password
  (app)/            → protected routes (dashboard, students, classes, etc.)
  api/              → auth, checkout, webhooks, report-card, demo-reset
components/         → UI organized by module
lib/                → Prisma queries, utilities, integration clients
store/              → Zustand state (view preferences, mobile menu)
prisma/
  schema.prisma     → complete data model
  seed.ts           → seed entry point (uses lib/seed-demo-data.ts)
```

## License

Single-use license, MIT-style.

Purchasing this product grants a non-exclusive license to:
- Use, modify, and deploy this code in **one (1)** project, for yourself or a client.
- Freely modify the code to fit your needs.

Not included:
- Reselling or redistributing the source code as-is, as a template, starter kit, or digital product.
- Use across multiple projects under a single purchase.

For multi-project licenses or extended terms, please reach out before purchasing.

This software is provided "as is," without explicit warranties regarding
performance in the buyer's specific environment.

## Support

This is a commercial starter kit. For installation or customization questions: [your email/support channel here].

user
admin@zenith.edu
director@zenith.edu

pass
Zenith2026!
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/perfil/change-password-form";

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Mi cuenta
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {session.user.name} · {session.user.email}
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
}

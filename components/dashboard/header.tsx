import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";
import { MobileMenuButton } from "./mobile-menu-button";

export async function Header({ name, role }: { name: string; role: string }) {
  const session = await auth();
  const unreadCount = session?.user
    ? await prisma.notification.count({
        where: { userId: session.user.id, read: false },
      })
    : 0;

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <p className="text-sm text-[var(--text-muted)]">
          {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell count={unreadCount} />
        <ThemeToggle />
        <UserMenu name={name} role={role} />
      </div>
    </header>
  );
}

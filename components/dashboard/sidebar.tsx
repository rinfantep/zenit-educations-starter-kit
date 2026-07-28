import { GraduationCap } from "lucide-react";
import { Role } from "@prisma/client";
import { getNavForRole } from "@/lib/nav-config";
import { SidebarLink } from "./sidebar-link";
import { MobileSidebarDrawer } from "./mobile-sidebar-toggle";

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  DIRECTOR: "Director",
  TEACHER: "Profesor",
  STUDENT: "Estudiante",
  PARENT: "Padre/Madre",
};

export function Sidebar({ role }: { role: Role }) {
  const items = getNavForRole(role);
  const navContent = (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--border-subtle)] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)]">
          <GraduationCap size={18} className="text-[var(--accent)]" />
        </div>
        <div>
          <p className="font-display text-base leading-none text-[var(--foreground)]">
            Zenith
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            {roleLabels[role]}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={<Icon size={17} />}
            />
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] lg:flex">
        {navContent}
      </aside>

      <MobileSidebarDrawer>{navContent}</MobileSidebarDrawer>
    </>
  );
}

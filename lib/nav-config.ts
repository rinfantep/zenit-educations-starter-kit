import { Role } from "@prisma/client";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  Wallet,
  MessageSquare,
  type LucideIcon,
  Settings,
  ShieldAlert,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER", "STUDENT", "PARENT"],
  },
  {
    label: "Estudiantes",
    href: "/estudiantes",
    icon: GraduationCap,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER"],
  },
  {
    label: "Profesores",
    href: "/profesores",
    icon: Users,
    roles: ["SUPER_ADMIN", "DIRECTOR"],
  },
  {
    label: "Clases",
    href: "/clases",
    icon: BookOpen,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER"],
  },
  {
    label: "Asistencia",
    href: "/asistencia",
    icon: ClipboardCheck,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER", "STUDENT"],
  },
  {
    label: "Evaluaciones",
    href: "/evaluaciones",
    icon: FileText,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER", "STUDENT"],
  },
  {
    label: "Finanzas",
    href: "/finanzas",
    icon: Wallet,
    roles: ["SUPER_ADMIN", "DIRECTOR"],
  },
  {
    label: "Auditoría",
    href: "/auditoria",
    icon: ShieldAlert,
    roles: ["SUPER_ADMIN", "DIRECTOR"],
  },
  {
    label: "Mis hijos",
    href: "/mis-hijos",
    icon: Users,
    roles: ["PARENT"],
  },
  {
    label: "Comunicación",
    href: "/comunicacion",
    icon: MessageSquare,
    roles: ["SUPER_ADMIN", "DIRECTOR", "TEACHER", "STUDENT", "PARENT"],
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: Settings,
    roles: ["SUPER_ADMIN", "DIRECTOR"],
  },
];

export function getNavForRole(role: Role) {
  return navItems.filter((item) => item.roles.includes(role));
}

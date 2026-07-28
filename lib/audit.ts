import { prisma } from "@/lib/prisma";

export async function logAudit({
  userId,
  action,
  entity,
  entityId,
  entityName,
  metadata,
}: {
  userId: string;
  action: "create" | "update" | "delete" | "deactivate" | "reactivate";
  entity: string;
  entityId?: string;
  entityName?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        entityName,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
      },
    });
  } catch (err) {
    // La auditoría nunca debe romper la acción principal — solo lo logueamos en consola
    console.error("Error al registrar auditoría:", err);
  }
}

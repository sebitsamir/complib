import prisma from "../prisma";

type AuditPayload = {
  userId?: string;
  action: string;
  resource?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(payload: AuditPayload): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: payload.userId ?? null,
        action: payload.action,
        resource: payload.resource ?? null,
        ip: payload.ip ?? null,
        metadata: payload.metadata ?? undefined,
      },
    });
  } catch {
    // Audit logging must never break primary requests.
  }
}

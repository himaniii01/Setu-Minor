import prisma from '../utils/prisma';

export const logAuditEvent = async (
  actor: string,
  action: string,
  resource: string,
  traceId: string,
  metadata: Record<string, any> = {}
) => {
  try {
    // Redact any sensitive keys if present (precautionary)
    const redactedMeta = { ...metadata };
    delete redactedMeta.password;
    delete redactedMeta.token;
    delete redactedMeta.password_hash;

    await prisma.auditLog.create({
      data: {
        actor,
        action,
        resource,
        trace_id: traceId,
        redacted_metadata: JSON.stringify(redactedMeta)
      }
    });
  } catch (err) {
    console.error('⚠️ Failed to write audit log:', err);
  }
};

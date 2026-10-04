import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendStandardError } from '../utils/helpers';
import { logAuditEvent } from '../middlewares/auditMiddleware';

export const getApiRegistries = async (req: AuthRequest, res: Response) => {
  try {
    const apis = await prisma.aPIRegistry.findMany({
      include: {
        services: { select: { name: true, code: true, integration_type: true } },
        transactions: {
          take: 5,
          orderBy: { created_at: 'desc' }
        }
      }
    });

    return res.json({ apis });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const toggleFailureSimulation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { simulate_failure, health } = req.body;

    const existing = await prisma.aPIRegistry.findUnique({
      where: { api_registry_id: id }
    });

    if (!existing) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'API Registry not found');
    }

    const updated = await prisma.aPIRegistry.update({
      where: { api_registry_id: id },
      data: {
        ...(simulate_failure !== undefined && { simulate_failure: Boolean(simulate_failure) }),
        ...(health && { health })
      }
    });

    const traceId = (res.getHeader('X-Trace-Id') as string) || 'tr-admin-sim';
    await logAuditEvent(`admin:${req.user?.user_id}`, 'ADMIN_CONNECTOR_TOGGLE', `api:${id}`, traceId, {
      simulate_failure: updated.simulate_failure,
      health: updated.health
    });

    return res.json({
      message: `Connector failure simulation updated for ${updated.service_name}`,
      api: updated
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getHealthMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const totalTransactions = await prisma.aPITransaction.count();
    const successfulTransactions = await prisma.aPITransaction.count({
      where: { outcome: 'SUCCESS' }
    });
    const failedTransactions = await prisma.aPITransaction.count({
      where: { outcome: { in: ['FAILURE', 'TIMEOUT'] } }
    });

    const apis = await prisma.aPIRegistry.findMany({
      select: {
        api_registry_id: true,
        service_name: true,
        protocol: true,
        health: true,
        simulate_failure: true,
        last_success_at: true
      }
    });

    return res.json({
      metrics: {
        totalGatewayCalls: totalTransactions,
        successCount: successfulTransactions,
        failureCount: failedTransactions,
        overallSuccessRate: totalTransactions > 0 ? ((successfulTransactions / totalTransactions) * 100).toFixed(1) + '%' : '100%',
        activeConnectors: apis.length
      },
      connectors: apis
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { trace_id, actor, search } = req.query;

    const where: any = {};
    if (trace_id) where.trace_id = trace_id as string;
    if (actor) where.actor = { contains: actor as string };
    if (search) {
      where.OR = [
        { action: { contains: search as string } },
        { resource: { contains: search as string } },
        { trace_id: { contains: search as string } }
      ];
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    return res.json({ count: auditLogs.length, auditLogs });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

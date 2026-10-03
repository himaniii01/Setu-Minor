import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendStandardError } from '../utils/helpers';
import { fetchPublicOpenDataCatalog } from '../connectors';

const prisma = new PrismaClient();

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category, state, search } = req.query;

    const where: any = {};
    if (category) where.category = category as string;
    if (state) where.state = state as string;
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { code: { contains: search as string } },
        { provider: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    const services = await prisma.governmentService.findMany({
      where,
      include: {
        api_registry: {
          select: {
            api_registry_id: true,
            service_name: true,
            health: true,
            protocol: true,
            simulate_failure: true
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    return res.json({
      count: services.length,
      services
    });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.governmentService.findUnique({
      where: { service_id: id },
      include: {
        api_registry: true
      }
    });

    if (!service) {
      return sendStandardError(res, 404, 'NOT_FOUND', 'Service not found');
    }

    return res.json({ service });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getServiceRecommendations = async (req: Request, res: Response) => {
  try {
    // Recommend top high-demand services across Education, Certificates, Health
    const services = await prisma.governmentService.findMany({
      take: 6,
      include: { api_registry: true }
    });

    return res.json({ recommendations: services });
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

export const getPublicDatasets = async (req: Request, res: Response) => {
  try {
    const data = await fetchPublicOpenDataCatalog();
    return res.json(data);
  } catch (err: any) {
    return sendStandardError(res, 500, 'SERVER_ERROR', err.message);
  }
};

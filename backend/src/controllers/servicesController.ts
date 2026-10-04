import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { sendStandardError } from '../utils/helpers';
import { fetchPublicOpenDataCatalog } from '../connectors';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const { category, state, search } = req.query;

    const where: any = {};
    if (category) where.category = category as string;
    if (state) where.state = state as string;
    if (search) {
      const q = search as string;
      where.OR = [
        { name: { contains: q } },
        { code: { contains: q } },
        { provider: { contains: q } },
        { description: { contains: q } }
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

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import xml2js from 'xml2js';

// Trace ID middleware
export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const traceId = (req.headers['x-trace-id'] as string) || `tr-${uuidv4().substring(0, 12)}`;
  req.headers['x-trace-id'] = traceId;
  res.setHeader('X-Trace-Id', traceId);
  next();
};

// Standard error response helper
export const sendStandardError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  traceId?: string
) => {
  return res.status(statusCode).json({
    error: {
      code,
      message,
      traceId: traceId || (res.getHeader('X-Trace-Id') as string) || 'tr-unknown'
    }
  });
};

// Safe JSON Parser
export const safeJsonParse = (str: string, fallback: any = {}) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
};

// XML to JSON parser for SOAP/XML connectors
export const parseXmlToJson = async (xmlString: string): Promise<any> => {
  const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
  return parser.parseStringPromise(xmlString);
};

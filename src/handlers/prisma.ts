import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const LATENCY_THRESHOLD = 1000; // Threshold in milliseconds

prisma.$use(async (params, next) => {
  const before = Date.now();
  try {
    const result = await next(params);
    const after = Date.now();
    const duration = after - before;

    logger.debug({
      message: `Query ${params.model}.${params.action} took ${duration}ms`,
      duration,
      model: params.model,
      action: params.action,
    });

    if (duration > LATENCY_THRESHOLD) {
      logger.warn({
        message: `High latency query: ${params.model}.${params.action}`,
        duration,
        model: params.model,
        action: params.action,
      });
    }

    return result;
  } catch (error) {
    logger.error({
      message: `Error executing query ${params.model}.${params.action}`,
      error,
      model: params.model,
      action: params.action,
    });

    throw error;
  }
});

export default prisma;

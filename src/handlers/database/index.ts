import { PrismaClient } from "@prisma/client";
import logger from "../../middlewares/logger";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const before = Date.now();

  const result = await next(params);

  const after = Date.now();

  logger.debug(
    `Query ${params.model}.${params.action} took ${after - before}ms`
  );

  if (after - before >= 50) {
    logger.warn(
      `Query ${params.model}.${params.action} took ${after - before}ms`
    );
  }

  return result;
});

export default prisma;

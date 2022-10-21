/* eslint-disable no-loops/no-loops */
import logger from "../../middlewares/logger";

import addSeconds from "../../helpers/addSeconds";

import prisma from "../../handlers/database";

export const options = {
  schedule: "*/30 * * * *", // https://crontab.guru/
};

// Execute the job
export const execute = async () => {
  const getCooldown = await prisma.cooldown.findMany();

  for await (const timeout of getCooldown) {
    const { guildId, userId, timeoutId, cooldown, createdAt } = timeout;

    const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

    if (overDue) {
      logger.info(timeout);
      const deleteCooldown = await prisma.cooldown.delete({
        where: {
          guildId_userId_timeoutId: {
            guildId,
            userId,
            timeoutId,
          },
        },
      });

      logger.silly(deleteCooldown);

      logger.debug(
        `Timeout document ${timeoutId} has been deleted from user ${userId}.`
      );
    }
  }
};

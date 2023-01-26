/* eslint-disable no-loops/no-loops */
import { add, formatDuration, intervalToDuration, isPast } from "date-fns";

import prisma from "../../handlers/prisma";
import logger from "../../middlewares/logger";

export const options = {
  schedule: "*/30 * * * *", // https://crontab.guru/
};

// Execute the job
export const execute = async () => {
  const cooldownsObj = await prisma.cooldown.findMany();

  for await (const cooldownObj of cooldownsObj) {
    const { guildId, userId, timeoutId, cooldown, createdAt } = cooldownObj;

    const dueDate = add(createdAt, { seconds: cooldown });
    if (!isPast(dueDate)) return;

    const duration = formatDuration(
      intervalToDuration({
        start: new Date(),
        end: dueDate,
      })
    );

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

    logger.verbose(
      `User ${userId} is on cooldown for ${timeoutId}, it ends in ${duration}.`
    );
  }
};

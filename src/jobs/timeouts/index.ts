import logger from "../../middlewares/logger";

import timeoutSchema from "../../models/timeout";

import addSeconds from "../../helpers/addSeconds";

export const options = {
  schedule: "*/30 * * * *", // https://crontab.guru/
};

export const execute = async () => {
  const timeouts = await timeoutSchema.find();
  await Promise.all(
    timeouts.map(async (timeout) => {
      const { guildId, userId, timeoutId, cooldown, createdAt } = timeout;

      const overDue = (await addSeconds(cooldown, createdAt)) < new Date();

      if (overDue) {
        timeoutSchema
          .deleteOne({
            guildId,
            userId,
            timeoutId,
            cooldown,
          })
          .then(() => {
            logger.debug(
              `Timeout document ${timeoutId} has been deleted from user ${userId}.`
            );
          });
      }
    })
  );
};

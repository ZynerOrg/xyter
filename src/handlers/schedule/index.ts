import { Client } from "discord.js";
import schedule from "node-schedule";
import checkDirectory from "../../helpers/checkDirectory";
import { IJob } from "../../interfaces/Job";
import logger from "../../middlewares/logger";

// Start all jobs that are in the schedules directory
export const start = async (client: Client) => {
  logger.info("⏰ Started job management");

  const jobNames = await checkDirectory("schedules");
  if (!jobNames) return logger.warn("No available jobs found");

  await Promise.all(
    jobNames.map(async (jobName) => {
      const job: IJob = await import(`../../schedules/${jobName}`);

      schedule.scheduleJob(job.options.schedule, async () => {
        logger.verbose(`⏰ Performed the job "${jobName}"`);
        await job.execute(client);
      });
    })
  );
};

import { Client } from "discord.js";
import schedule from "node-schedule";
import { IJob } from "../interfaces/Job";
import logger from "../utils/logger";
import checkDirectory from "../utils/readDirectory";

export default async (client: Client) => {
  const profiler = logger.startTimer();

  const jobNames = await checkDirectory("jobs");

  const executeJob = async (job: IJob, jobName: string) => {
    const jobProfiler = logger.startTimer();
    try {
      await job.execute(client);
      jobProfiler.done({
        message: `Successfully executed job '${jobName}'`,
        level: "debug",
        job,
        jobName,
      });
    } catch (error) {
      jobProfiler.done({
        message: `Failed executing job '${jobName}'`,
        level: "debug",
        job,
        jobName,
      });
    }
  };

  const importJob = async (jobName: string) => {
    try {
      const job = (await import(`../jobs/${jobName}`)) as IJob;

      // Check if the bot is already logged in
      if (client.readyAt) {
        schedule.scheduleJob(job.options.schedule, () => {
          executeJob(job, jobName);
        });
      } else {
        // Wait for the bot to be ready before scheduling the job
        client.once("ready", () => {
          schedule.scheduleJob(job.options.schedule, () => {
            executeJob(job, jobName);
          });
        });
      }
    } catch (error) {
      logger.warn({
        jobName,
        message: `Failed to schedule job ${jobName}`,
        error,
      });
    }
  };

  await Promise.all(jobNames.map(importJob));

  return profiler.done({
    message: "Successfully scheduled all jobs!",
  });
};

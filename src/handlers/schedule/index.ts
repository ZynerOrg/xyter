import { Client } from "discord.js";
import schedule from "node-schedule";
import checkDirectory from "../../helpers/checkDirectory";
import { IJob } from "../../interfaces/Job";
import logger from "../../middlewares/logger";

// Start all jobs that are in the schedules directory
export const start = async (client: Client) => {
  const profiler = logger.startTimer();

  await checkDirectory("schedules").then((jobNames) => {
    jobNames.forEach(async (jobName) => {
      await import(`../../schedules/${jobName}`)
        .then((job: IJob) => {
          schedule.scheduleJob(job.options.schedule, async () => {
            const jobProfiler = logger.startTimer();
            await job
              .execute(client)
              .then(() => {
                jobProfiler.done({
                  message: `Successfully executed job '${jobName}'`,
                  level: "debug",
                  job,
                  jobName,
                });
              })
              .catch(() => {
                jobProfiler.done({
                  message: `Failed executing job '${jobName}'`,
                  level: "debug",
                  job,
                  jobName,
                });
              });
          });
        })
        .catch((error) => {
          logger.warn({
            jobName,
            message: `Failed to schedule job ${jobName}`,
            error,
          });
        });
    });
  });

  return profiler.done({
    message: "Successfully scheduled all jobs!",
  });
};

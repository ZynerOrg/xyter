import { Client } from "discord.js";
import { IEvent } from "../interfaces/Event";
import logger from "../utils/logger";
import checkDirectory from "../utils/readDirectory";

export default async (client: Client) => {
  const profiler = logger.startTimer();

  try {
    const eventNames = await checkDirectory("events");

    const importEvent = async (name: string) => {
      try {
        const event = (await import(`../events/${name}`)) as IEvent;

        const eventExecutor = async (...args: Promise<void>[]) => {
          try {
            await event.execute(...args);
          } catch (error) {
            logger.error(`Error occurred in event '${name}':`, error);
          }
        };

        switch (event.options.type) {
          case "once":
            client.once(name, eventExecutor);
            break;
          case "on":
            client.on(name, eventExecutor);
            break;
          default:
            throw new Error(`Unknown event type: ${event.options.type}`);
        }

        logger.debug({
          eventName: name,
          type: event.options.type,
          message: `Listening to event '${name}'`,
        });

        return event;
      } catch (error) {
        logger.error(
          `Error occurred while registering event '${name}':`,
          error
        );
      }
    };

    await Promise.all(eventNames.map(importEvent));

    profiler.done({
      message: "Successfully listening to all events!",
    });
  } catch (error) {
    logger.error("Error occurred during event registration:", error);
  }
};

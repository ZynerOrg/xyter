import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { IEvent } from "../../interfaces/Event";
import logger from "../../middlewares/logger";

// Registers all available events.
export const register = async (client: Client) => {
  const profiler = logger.startTimer();

  await checkDirectory("events").then((eventNames) => {
    // Import an event.
    const importEvent = async (name: string) => {
      await import(`../../events/${name}`).then((event: IEvent) => {
        // Create a new event execute function.
        const eventExecutor = async (...args: Promise<void>[]) => {
          await event.execute(...args);
        };

        switch (event.options.type) {
          case "once":
            client.once(name, eventExecutor);
            break;

          case "on":
            client.on(name, eventExecutor);
            break;
          default:
            throw new Error(`Unknown event type`);
        }

        logger.debug({
          eventName: name,
          type: event.options.type,
          message: `Listening to event '${name}'`,
        });

        return event;
      });
    };

    eventNames.forEach(async (eventName) => {
      await importEvent(eventName);
    });
  });

  return profiler.done({
    message: "Successfully listening to all events!",
  });
};

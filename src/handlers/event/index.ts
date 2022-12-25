/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { IEvent } from "../../interfaces/Event";
import logger from "../../middlewares/logger";

// Registers all available events.
export const register = async (client: Client) => {
  const profiler = logger.startTimer();

  await checkDirectory("events").then(async (eventNames) => {
    const totalEvents = eventNames.length;
    let loadedEvents = 0;

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
        return loadedEvents++;
      });
    };

    for await (const eventName of eventNames) {
      await importEvent(eventName);

      if (loadedEvents === totalEvents) {
        return profiler.done({
          message: "Successfully listening to all events!",
        });
      }
    }

    return true;
  });
};

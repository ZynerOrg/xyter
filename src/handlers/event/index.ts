/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import checkDirectory from "../../helpers/checkDirectory";
import { IEvent } from "../../interfaces/Event";
import logger from "../../middlewares/logger";

// Registers all available events.
export const register = async (client: Client) => {
  logger.info("📡 Started event management");

  const eventNames = await checkDirectory("events");
  if (!eventNames) return logger.warn("No available events found");

  const totalEvents = eventNames.length;
  let loadedEvents = 0;

  logger.info(`📡 Loading ${totalEvents} events`);

  // Import an event.
  const importEvent = async (name: string) => {
    const event: IEvent = await import(`../../events/${name}`);

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
        throw new Error(`📡 Invalid event type for event: ${name}`);
    }

    return loadedEvents++;
  };

  for await (const eventName of eventNames) {
    await importEvent(eventName).then(() => {
      return logger.verbose(`📡 Loaded event "${eventName}"`);
    });

    if (loadedEvents === totalEvents) {
      return logger.info("📡 All events loaded");
    }
  }

  return true;
};

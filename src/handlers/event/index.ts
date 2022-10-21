/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import listDir from "../../helpers/checkDirectory";
import { IEvent } from "../../interfaces/Event";
import logger from "../../middlewares/logger";

// Registers all available events
export const register = async (client: Client) => {
  const eventNames = await listDir("events");
  if (!eventNames) throw new Error("📦 No events available");

  const amountOfEvents = eventNames.length;
  let importedEventAmount = 0;
  logger.info(`📦 Trying to load ${amountOfEvents} events`);

  const importEvent = async (eventName: string) => {
    // Import event from events
    const event: IEvent = await import(`../../events/${eventName}`);
    if (!event)
      throw new Error(`📦 No event found while importing "${eventName}"`);
    if (!event.options)
      throw new Error(
        `📦 No event options found while importing "${eventName}"`
      );
    if (!event.execute)
      throw new Error(
        `📦 No event execute found while importing "${eventName}"`
      );

    // Register event
    const eventExecutor = async (...args: Promise<void>[]) => {
      await event.execute(...args).catch((err) => {
        logger.error(`${err}`);
      });
    };

    if (!event.options?.type)
      throw new Error(`📦 No event type found while importing "${eventName}"`);

    switch (event.options.type) {
      case "once":
        client.once(eventName, eventExecutor);
        break;

      case "on":
        client.on(eventName, eventExecutor);
        break;
      default:
        logger.error(`${eventName} does not have a valid type`);
    }
    importedEventAmount += 1;
  };

  // Send log message when it's done loading events
  const doneImporting = () => {
    if (importedEventAmount !== amountOfEvents) {
      return logger.warn(
        `📦 Failed importing ${
          amountOfEvents - importedEventAmount
        } of ${amountOfEvents} events`
      );
    }

    return logger.info(`📦 Managed to load all events`);
  };

  eventNames.forEach(async (eventName: string, index: number) => {
    await importEvent(eventName).then(() => {
      logger.debug(`📦 Imported the "${eventName}" event`);
    });

    // If done importing
    if (index + 1 === amountOfEvents) {
      await doneImporting();
    }
  });

  // for await (const eventName of eventNames) {
  //   const event: IEvent = await import(`../../events/${eventName}`);
  //   const eventExecutor = async (...args: Promise<void>[]) =>
  //     event.execute(...args).catch(async (err) => {
  //       logger.error(`${err}`);
  //     });
  //   if (!event.options?.type) return;

  //   switch (event.options.type) {
  //     case "once":
  //       client.once(eventName, eventExecutor);
  //       break;

  //     case "on":
  //       client.on(eventName, eventExecutor);
  //       break;
  //   }
  // }
};

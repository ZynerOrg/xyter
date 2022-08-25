// Dependencies
import { Message } from "discord.js";
import logger from "../../../middlewares/logger";

// Modules
import counter from "./modules/counter";

import { IEventOptions } from "../../../interfaces/EventOptions";
import audits from "./audits";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (oldMessage: Message, newMessage: Message) => {
  const { author, guild } = newMessage;

  await audits.execute(oldMessage, newMessage);

  logger?.silly(
    `Message update event fired by ${author.tag} (${author.id}) in guild: ${guild?.name} (${guild?.id})`
  );

  if (author?.bot) return logger?.silly(`Message update event fired by bot`);

  await counter(newMessage);
};

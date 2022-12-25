// Dependencies
import { Message } from "discord.js";

// Modules
import counter from "./modules/counter";

import { IEventOptions } from "../../interfaces/EventOptions";
import audits from "./audits";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (oldMessage: Message, newMessage: Message) => {
  const { author } = newMessage;

  await audits.execute(oldMessage, newMessage);

  if (author.bot) return;

  await counter(newMessage);

  return;
};

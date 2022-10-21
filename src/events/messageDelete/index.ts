import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import audits from "./audits";
import counter from "./modules/counter";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (message: Message) => {
  await audits.execute(message);
  await counter(message);
};

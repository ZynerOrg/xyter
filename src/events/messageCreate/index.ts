import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import modules from "./modules";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (message: Message) => {
  await modules.credits.execute(message);
  await modules.points.execute(message);
  await modules.counters.execute(message);
};

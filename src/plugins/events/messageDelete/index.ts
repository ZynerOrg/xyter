import { Message } from "discord.js";
import { IEventOptions } from "../../../interfaces/EventOptions";
import audits from "../../events/messageDelete/audits";
import counter from "./modules/counter";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await audits.execute(message);
  await counter(message);
};

import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import sendAuditEntry from "./components/sendAuditEntry";
import updateCounter from "./components/updateCounter";

export const options: IEventOptions = {
  type: "on",
};

// Execute the function
export const execute = async (message: Message) => {
  await sendAuditEntry(message);
  await updateCounter(message);
};

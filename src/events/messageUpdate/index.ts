import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import sendAuditEntry from "./components/sendAuditEntry";
import updateCounter from "./components/updateCounter";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (oldMessage: Message, newMessage: Message) => {
  await sendAuditEntry(oldMessage, newMessage);
  await updateCounter(newMessage);
};

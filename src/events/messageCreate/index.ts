import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import earnCredits from "./components/earnCredits";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await earnCredits(message);
};

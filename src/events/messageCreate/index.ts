import { Message } from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import countersExecute from "./modules/counters";
import creditsExecute from "./modules/credits";
import pointsExecute from "./modules/points";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (message: Message) => {
  await creditsExecute(message);
  await pointsExecute(message);
  await countersExecute(message);
};

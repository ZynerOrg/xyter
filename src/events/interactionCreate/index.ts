// 3rd party dependencies
import {
  BaseInteraction,
  CommandInteraction,
  InteractionType,
} from "discord.js";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
// Dependencies
import audits from "./audits";
import { handleCommandInteraction as HandlersHandleCommandInteraction } from "./handlers";

export const options: IEventOptions = {
  type: "on",
};

// Execute the event
export const execute = async (interaction: BaseInteraction) => {
  const { guild, id } = interaction;

  logger?.silly(
    `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
  );

  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      await HandlersHandleCommandInteraction(<CommandInteraction>interaction);
      break;

    default:
      logger?.error(`Unknown interaction type: ${interaction.type}`);
  }

  await audits.execute(interaction);
};

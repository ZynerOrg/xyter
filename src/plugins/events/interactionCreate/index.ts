// 3rd party dependencies
import {
  BaseInteraction,
  CommandInteraction,
  InteractionType,
} from "discord.js";

// Dependencies
import * as handlers from "./handlers";

import { IEventOptions } from "../../../interfaces/EventOptions";
import logger from "../../../middlewares/logger";
import audits from "./audits";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: BaseInteraction) => {
  const { guild, id } = interaction;

  logger?.silly(
    `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
  );

  await audits.execute(interaction);

  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      await handlers.handleCommandInteraction(<CommandInteraction>interaction);
      break;

    default:
      logger?.error(`Unknown interaction type: ${interaction.type}`);
  }
};

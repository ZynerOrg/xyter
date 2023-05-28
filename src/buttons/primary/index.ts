import { ButtonInteraction } from "discord.js";
import logger from "../../utils/logger";

export const metadata = { guildOnly: false, ephemeral: false };

// Execute the function
export const execute = (interaction: ButtonInteraction) => {
  logger.debug(interaction.customId, "primary button clicked!");
};

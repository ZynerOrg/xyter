import { BaseInteraction } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";
import button from "./interactionTypes/button";
import handleCommandInteraction from "./interactionTypes/handleCommandInteraction";

export const options: IEventOptions = {
  type: "on",
};

export async function execute(interaction: BaseInteraction) {
  const { guild, user } = interaction;

  logInteraction();

  if (guild) {
    await upsertGuildMember(guild, user);
  }

  if (interaction.isCommand()) {
    await handleCommandInteraction(interaction);
  } else if (interaction.isButton()) {
    await button(interaction);
  } else {
    logError("Unknown interaction type");
  }

  function logInteraction() {
    logger.verbose({
      message: `New interaction created: ${interaction.id} by: ${user.tag} (${user.id})`,
      interactionId: interaction.id,
      userId: user.id,
      guildId: guild?.id,
    });
  }

  function logError(errorMessage: string) {
    logger.error({
      message: errorMessage,
      error: new Error(errorMessage),
      interactionId: interaction.id,
      userId: user.id,
      guildId: guild?.id,
    });
    throw new Error(errorMessage);
  }
}

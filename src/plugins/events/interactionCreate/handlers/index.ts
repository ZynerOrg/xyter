import { BaseInteraction, CommandInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import capitalizeFirstLetter from "../../../../helpers/capitalizeFirstLetter";
import logger from "../../../../middlewares/logger";

import button from "./button";
import command from "./command";

export const execute = async (interaction: BaseInteraction) => {
  await button(interaction);
  await command(interaction);
};

export const handleCommandInteraction = async (
  interaction: CommandInteraction
) => {
  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await command(interaction).catch(async (err) => {
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`[:x:] ${capitalizeFirstLetter(interaction.commandName)}`)
          .setDescription(`${"``"}${err}${"``"}`)
          .setColor(errorColor)
          .setTimestamp(new Date())
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  });
};

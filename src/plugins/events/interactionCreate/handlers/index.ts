import {
  BaseInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import capitalizeFirstLetter from "../../../../helpers/capitalizeFirstLetter";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import button from "./button";
import command from "./command";

export const execute = async (interaction: BaseInteraction) => {
  await button(<ButtonInteraction>interaction);
  await command(<ChatInputCommandInteraction>interaction);
};

export const handleCommandInteraction = async (
  interaction: CommandInteraction
) => {
  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await command(<ChatInputCommandInteraction>interaction).catch((err) => {
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

import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import getEmbedConfig from "../../../helpers/getEmbedData";
import button from "./button";
import command from "./command";

// Send interactions to all available handlers
export const execute = async (interaction: BaseInteraction) => {
  await button(<ButtonInteraction>interaction);
  await command(<ChatInputCommandInteraction>interaction);
};

// Handle interactions from commands
export const handleCommandInteraction = async (
  interaction: CommandInteraction
) => {
  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await command(<ChatInputCommandInteraction>interaction).catch((err) => {
    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Report Problem")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📝")
        .setURL("https://discord.zyner.org")
    );

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`:no_entry_sign:︱Your request failed`)
          .setDescription(`${err.message}`)
          .setColor(errorColor)
          .setTimestamp(new Date())
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
      components: [buttons],
    });
  });
};

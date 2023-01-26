import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import checkPermission from "../../../../helpers/checkPermission";
import deferReply from "../../../../helpers/deferReply";
import getValues from "./components/getValues";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("embeds")
    .setDescription(`Embeds`)
    .addStringOption((option) =>
      option
        .setName("success-color")
        .setDescription("No provided description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("wait-color")
        .setDescription("No provided description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("error-color")
        .setDescription("No provided description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("footer-icon")
        .setDescription("No provided description")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("footer-text")
        .setDescription("No provided description")
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { guild } = interaction;
  if (!guild) throw new Error("Guild not found");

  const { successColor, waitColor, errorColor, footerText, footerIcon } =
    await getValues(interaction);

  const embed = new EmbedBuilder()
    .setTitle("[:tools:] Embeds")
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  embed
    .setDescription("Following embed configuration will be used.")
    .setColor(successColor)
    .addFields([
      {
        name: "🟢 Success Color",
        value: `${successColor}`,
        inline: true,
      },
      {
        name: "🟡 Wait Color",
        value: `${waitColor}`,
        inline: true,
      },
      {
        name: "🔴 Error Color",
        value: `${errorColor}`,
        inline: true,
      },
      {
        name: "🖼️ Footer Icon",
        value: `${footerIcon}`,
        inline: true,
      },
      {
        name: "📄 Footer Text",
        value: `${footerText}`,
        inline: true,
      },
    ]);

  await interaction.editReply({
    embeds: [embed],
  });
  return;
};

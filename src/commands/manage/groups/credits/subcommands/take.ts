// Dependencies
// Models
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import checkPermission from "../../../../../helpers/checkPermission";
import deferReply from "../../../../../helpers/deferReply";
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";
import economy from "../../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("take")
    .setDescription("Take credits from a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to take credits from.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to take.`)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, options } = interaction;

  await deferReply(interaction, true);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  if (!guild) throw new Error("Invalid guild.");
  if (!options) throw new Error("Invalid options.");

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const discordReceiver = options.getUser("user");
  const optionAmount = options.getInteger("amount");
  if (typeof optionAmount !== "number") throw new Error("Invalid amount.");
  if (!discordReceiver) throw new Error("Invalid user.");

  await economy.take(guild, discordReceiver, optionAmount);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":toolbox:︱Take")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `Took ${optionAmount} credits from ${discordReceiver}.`
      ),
    ],
  });
};

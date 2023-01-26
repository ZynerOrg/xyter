// Dependencies
// Helpers
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
    .setName("set")
    .setDescription("Set the amount of credits a user has.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to set the amount of credits for.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to set.`)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, guild } = interaction;

  await deferReply(interaction, true);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  if (!guild) throw new Error(`We could not find this guild.`);
  if (!options) throw new Error(`We could not find the options.`);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const discordUser = options.getUser("user");
  const creditAmount = options.getInteger("amount");
  if (typeof creditAmount !== "number") throw new Error("Amount is not set.");
  if (!discordUser) throw new Error("User is not specified");

  await economy.set(guild, discordUser, creditAmount);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":toolbox:︱Set")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `Set **${discordUser}**'s credits to **${creditAmount}**.`
      ),
    ],
  });
};

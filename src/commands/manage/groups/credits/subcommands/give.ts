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
    .setName("give")
    .setDescription("Give credits to a user.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to give credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to give.`)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, options } = interaction;

  await deferReply(interaction, true);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  if (!guild)
    throw new Error("We could not get the current guild from discord.");
  if (!options) throw new Error("We could not get the options from discord.");

  const discordReceiver = options.getUser("user");
  const creditsAmount = options.getInteger("amount");
  if (typeof creditsAmount !== "number")
    throw new Error("You need to provide a credit amount.");
  if (!discordReceiver)
    throw new Error("We could not get the receiving user from Discord");

  const embedSuccess = new EmbedBuilder()
    .setTitle(":toolbox:︱Give")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  await economy.give(guild, discordReceiver, creditsAmount);

  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(`Successfully gave ${creditsAmount} credits`),
    ],
  });
};

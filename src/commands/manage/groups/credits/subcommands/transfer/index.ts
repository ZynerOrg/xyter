// Dependencies
// Models
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
// Configurations
import checkPermission from "../../../../../../helpers/checkPermission";
import deferReply from "../../../../../../helpers/deferReply";
import getEmbedConfig from "../../../../../../helpers/getEmbedConfig";
import economy from "../../../../../../modules/credits";

// Function
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("transfer")
    .setDescription("Transfer credits from one user to another.")
    .addUserOption((option) =>
      option
        .setName("from")
        .setDescription("The user to transfer credits from.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to")
        .setDescription("The user to transfer credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription(`The amount of credits to transfer.`)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  ); // Destructure member
  const { guild, options } = interaction;

  // Get options
  const optionFromUser = options?.getUser("from");
  const optionToUser = options?.getUser("to");
  const optionAmount = options?.getInteger("amount");

  if (optionAmount === null) throw new Error("Amount is not specified");

  if (optionAmount <= 0)
    throw new Error("You need to set amount above zero to transfer.");

  if (!guild) throw new Error(`We could not find this guild.`);

  if (!optionFromUser)
    throw new Error("You must provide a user to transfer from.");

  if (!optionToUser) throw new Error("You must provide a user to transfer to.");

  await economy.transfer(guild, optionFromUser, optionToUser, optionAmount);

  return interaction?.editReply({
    embeds: [
      new EmbedBuilder()
        .setTitle("[:toolbox:] Manage - Credits (Transfer)")
        .setDescription(`Transferred ${optionAmount} credits.`)
        .setTimestamp(new Date())
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon }),
    ],
  });
};

// Dependencies
// Models
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { success as baseEmbedSuccess } from "../../../../../../helpers/baseEmbeds";
import checkPermission from "../../../../../../helpers/checkPermission";
import deferReply from "../../../../../../helpers/deferReply";
import economy from "../../../../../../modules/credits";

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
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Check if the user has the MANAGE_GUILD permission.
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  // 3. Destructure interaction object.
  const { guild, options } = interaction;
  if (!guild) throw new Error("Invalid guild.");
  if (!options) throw new Error("Invalid options.");

  // 4. Get the user and amount from the options.
  const discordReceiver = options.getUser("user");
  const optionAmount = options.getInteger("amount");
  if (typeof optionAmount !== "number") throw new Error("Invalid amount.");
  if (!discordReceiver) throw new Error("Invalid user.");

  // 5. Create base embeds.
  const embedSuccess = await baseEmbedSuccess(guild, "[:toolbox:] Take");

  // 6. Take the credits.
  await economy.take(guild, discordReceiver, optionAmount);

  // 7. Send embed.
  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `Took ${optionAmount} credits from ${discordReceiver}.`
      ),
    ],
  });
};

// Dependencies
// Helpers
// Models
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import deferReply from "../../../../../../handlers/deferReply";
import { success as baseEmbedSuccess } from "../../../../../../helpers/baseEmbeds";
import checkPermission from "../../../../../../helpers/checkPermission";
import creditsSet from "../../../../../../helpers/credits/set";

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
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Check if the user has the permission to manage the guild.
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  // 3. Destructure interaction object.
  const { options, guild } = interaction;
  if (!guild) throw new Error(`We could not find this guild.`);
  if (!options) throw new Error(`We could not find the options.`);

  // 4. Get the user and amount from the options.
  const discordUser = options.getUser("user");
  const creditAmount = options.getInteger("amount");
  if (typeof creditAmount !== "number") throw new Error("Amount is not set.");
  if (!discordUser) throw new Error("User is not specified");

  // 5. Set the credits.
  await creditsSet(guild, discordUser, creditAmount);

  // 6. Create base embeds.
  const embedSuccess = await baseEmbedSuccess(guild, "[:toolbox:] Set");

  // 7. Send embed.
  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `Set **${discordUser}**'s credits to **${creditAmount}**.`
      ),
    ],
  });
};

// Dependencies
import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
// Configurations
// Helpers../../../../../../../helpers/userData
import pluralize from "../../../../../../helpers/pluralize";
// Models
// Handlers
import deferReply from "../../../../../../handlers/deferReply";
import { success as baseEmbedSuccess } from "../../../../../../helpers/baseEmbeds";
import checkPermission from "../../../../../../helpers/checkPermission";
import creditsGive from "../../../../../../helpers/credits/give";

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
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Check if the user has the MANAGE_GUILD permission.
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  // 3. Destructure interaction object.
  const { guild, options } = interaction;
  if (!guild)
    throw new Error("We could not get the current guild from discord.");
  if (!options) throw new Error("We could not get the options from discord.");

  // 4. Get the user and amount from the options.
  const discordReceiver = options.getUser("user");
  const creditsAmount = options.getInteger("amount");
  if (typeof creditsAmount !== "number")
    throw new Error("You need to provide a credit amount.");
  if (!discordReceiver)
    throw new Error("We could not get the receiving user from Discord");

  // 5. Create base embeds.
  const embedSuccess = await baseEmbedSuccess(guild, "[:toolbox:] Give");

  // 6. Give the credits.
  await creditsGive(guild, discordReceiver, creditsAmount);

  // 7. Send embed.
  return await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `Successfully gave ${pluralize(creditsAmount, "credit")}`
      ),
    ],
  });
};

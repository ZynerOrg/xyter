import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import CreditsManager from "../../../../../../handlers/CreditsManager";
import checkPermission from "../../../../../../utils/checkPermission";
import deferReply from "../../../../../../utils/deferReply";
import sendResponse from "../../../../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (
  command: SlashCommandSubcommandBuilder
): SlashCommandSubcommandBuilder => {
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
        .setDescription("The amount of credits to give.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(2147483647)
    );
};

export const execute = async (
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const { guild, options, user } = interaction;

  await deferReply(interaction, false);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  if (!guild) {
    throw new Error("We could not get the current guild from Discord.");
  }

  const discordReceiver = options.getUser("user", true);
  const creditsAmount = options.getInteger("amount", true);

  if (!discordReceiver || typeof creditsAmount !== "number") {
    await sendResponse(interaction, "Invalid user or credit amount provided.");
    return;
  }

  const embedSuccess = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setAuthor({ name: "💳 Credits Manager" })
    .setDescription(
      `    Successfully gave ${creditsAmount} credits to the user.`
    )
    .setFooter({
      text: `Action by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  await creditsManager.give(guild, discordReceiver, creditsAmount);

  await sendResponse(interaction, { embeds: [embedSuccess] });
};

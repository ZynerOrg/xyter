import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import ReputationManager from "../../../../handlers/ReputationManager";
import deferReply from "../../../../utils/deferReply";
import sendResponse from "../../../../utils/sendResponse";

const reputationManager = new ReputationManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("check")
    .setDescription("Check reputation")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you are checking")
        .setRequired(false)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, false);

  const { options, user } = interaction;

  const checkUser = options.getUser("user") || user;

  if (!user) throw new Error("User unavailable");

  const userReputation = await reputationManager.check(checkUser);

  const interactionEmbed = new EmbedBuilder()
    .setAuthor({
      name: `Showing ${checkUser.username}'s reputation`,
    })
    .setDescription(
      `**User:** ${checkUser}\n\n` +
        `**Reputation:**\n` +
        `- Negative: ${userReputation.negative}\n` +
        `- Positive: ${userReputation.positive}\n` +
        `- Total: ${userReputation.total}`
    )
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setThumbnail(checkUser.displayAvatarURL())
    .setTimestamp()
    .setColor(process.env.EMBED_COLOR_SUCCESS);

  await sendResponse(interaction, {
    embeds: [interactionEmbed],
  });
};

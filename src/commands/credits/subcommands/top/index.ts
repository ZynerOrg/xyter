import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  User,
} from "discord.js";
import CreditsManager from "../../../../handlers/CreditsManager";
import deferReply from "../../../../utils/deferReply";
import sendResponse from "../../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("top")
    .setDescription("View the top users in the server.");
};

export const execute = async (interaction: CommandInteraction) => {
  const { guild, client, user } = interaction;

  await deferReply(interaction, false);

  if (!guild) {
    throw new Error("Unable to find the guild.");
  }

  const topTen = await creditsManager.topUsers(guild, 10);

  const embed = new EmbedBuilder()
    .setTimestamp()
    .setAuthor({ name: "🏅 Top Users" })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    });

  const medalEmojis = ["🥇", "🥈", "🥉"];
  const genericMedalEmoji = "🏅";

  const filteredTopTen = topTen.filter((topAccount) => topAccount.balance > 0);

  const fetchUser = async (userId: string): Promise<User | null> => {
    const fetchedUser = await client.users.fetch(userId);
    return fetchedUser;
  };

  const topUsersDescription = await Promise.all(
    filteredTopTen.map(async (topAccount, index) => {
      const position = index + 1;
      const fetchedUser = await fetchUser(topAccount.userId);
      const userDisplayName = fetchedUser?.username || "Unknown User";
      const fieldContent = `${userDisplayName} with ${topAccount.balance} credits`;
      const medalEmoji =
        position <= 3 ? medalEmojis[position - 1] : genericMedalEmoji;
      return `\`${medalEmoji} ${fieldContent}\``;
    })
  );

  const description = `Here are the top users in this server:\n\n${topUsersDescription.join(
    "\n"
  )}`;
  embed.setDescription(description);

  await sendResponse(interaction, { embeds: [embed] });
};

import config from "../../../../config.json";
import users from "../../../helpers/database/models/userSchema";
import creditNoun from "../../../helpers/creditNoun";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  // Get all users in the guild

  const usersDB = await users.find({ guildId: interaction?.guild?.id });

  const topTen = usersDB

    // Sort them after credits amount (ascending)
    .sort((a, b) => (a.credits > b.credits ? -1 : 1))

    // Return the top 10
    .slice(0, 10);

  // Create entry object
  const entry = (x: any, index: any) =>
    `**Top ${index + 1}** - <@${x.userId}> ${creditNoun(x.credits)}`;

  // Create embed object
  const embed = {
    title: ":dollar: Credits - Top",
    description: `Below are the top ten.\n${topTen
      .map((x, index) => entry(x, index))
      .join("\n")}`,
    color: config.colors.success as any,
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send interaction reply
  return interaction.editReply({ embeds: [embed] });
};

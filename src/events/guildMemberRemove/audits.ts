import { formatDistanceToNow } from "date-fns";
import { EmbedBuilder, GuildMember } from "discord.js";
import auditLogger from "../../helpers/auditLogger";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";

export default {
  execute: async (member: GuildMember) => {
    const { guild } = member;

    if (!member.joinedAt) throw new Error("Can not find joined date");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Member Left",
        iconURL: member.displayAvatarURL(),
      })
      .addFields([
        {
          name: "User",
          value: `${member.user} (${member.user.tag})`,
          inline: true,
        },
        {
          name: "Member since",
          value: `${capitalizeFirstLetter(
            formatDistanceToNow(member.joinedAt, { addSuffix: true })
          )}`,
          inline: true,
        },
        {
          name: "Created",
          value: `${capitalizeFirstLetter(
            formatDistanceToNow(member.user.createdAt, { addSuffix: true })
          )}`,
          inline: true,
        },
      ]);

    await auditLogger(guild, embed);
  },
};

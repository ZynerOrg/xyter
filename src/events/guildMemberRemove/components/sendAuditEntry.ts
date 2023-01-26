import { formatDistanceToNow } from "date-fns";
import { EmbedBuilder, GuildMember } from "discord.js";
import voca from "voca";
import auditLogger from "../../../helpers/sendAuditLog";

export default async (member: GuildMember) => {
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
        value: `${voca.capitalize(
          formatDistanceToNow(member.joinedAt, { addSuffix: true })
        )}`,
        inline: true,
      },
      {
        name: "Created",
        value: `${voca.capitalize(
          formatDistanceToNow(member.user.createdAt, { addSuffix: true })
        )}`,
        inline: true,
      },
    ]);

  await auditLogger(guild, embed);
};

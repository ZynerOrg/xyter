import { formatDistanceToNow } from "date-fns";
import { EmbedBuilder, Message } from "discord.js";
import voca from "voca";
import auditLogger from "../../../helpers/sendAuditLog";

export default async (message: Message) => {
  const { guild, member } = message;
  if (!guild) throw new Error("Guild unavailable");
  if (!member) throw new Error("Member unavailable");

  if (!member.joinedAt) throw new Error("Can not find member joined at");

  const embed = new EmbedBuilder()
    .setAuthor({
      name: "Message Deleted",
      iconURL: message.author.displayAvatarURL(),
    })
    .addFields([
      {
        name: "User",
        value: `${message.author} (${message.author.tag})`,
        inline: true,
      },
      {
        name: "Member since",
        value: `${voca.capitalize(
          formatDistanceToNow(member.joinedAt, {
            addSuffix: true,
          })
        )}`,
        inline: true,
      },
      {
        name: "Created",
        value: `${voca.capitalize(
          formatDistanceToNow(message.author.createdAt, { addSuffix: true })
        )}`,
        inline: true,
      },
      {
        name: "Content",
        value: `${
          message.content.length <= 1024
            ? message.content
            : "Length is above 1024, this is a [limit by Discord](https://discord.com/developers/docs/resources/channel#embed-object-embed-limits), we are working on an solution to this problem."
        }`,
      },
    ]);

  await auditLogger(guild, embed);
};

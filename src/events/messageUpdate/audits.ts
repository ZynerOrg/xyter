/* eslint-disable no-loops/no-loops */
import { formatDistanceToNow } from "date-fns";
import { EmbedBuilder, Message } from "discord.js";
import auditLogger from "../../helpers/auditLogger";
import capitalizeFirstLetter from "../../helpers/capitalizeFirstLetter";

export default {
  execute: async (oldMessage: Message, newMessage: Message) => {
    const { guild, member } = newMessage;
    if (!guild) throw new Error("Guild unavailable");
    if (!member) throw new Error("Member unavailable");

    if (!member.joinedAt) throw new Error("Can not find member joined at");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Message Updated",
        iconURL: newMessage.author.displayAvatarURL(),
      })
      .addFields([
        {
          name: "User",
          value: `${newMessage.author} (${newMessage.author.tag})`,
          inline: true,
        },
        {
          name: "Member since",
          value: `${capitalizeFirstLetter(
            formatDistanceToNow(member.joinedAt, {
              addSuffix: true,
            })
          )}`,
          inline: true,
        },
        {
          name: "Created",
          value: `${capitalizeFirstLetter(
            formatDistanceToNow(newMessage.author.createdAt, {
              addSuffix: true,
            })
          )}`,
          inline: true,
        },
        {
          name: "Before edited",
          value: `${
            oldMessage.content.length <= 1024
              ? oldMessage.content
              : "Length is above 1024, this is a [limit by Discord](https://discord.com/developers/docs/resources/channel#embed-object-embed-limits), we are working on an solution to this problem."
          }`,
        },
        {
          name: "After edited",
          value: `${
            newMessage.content.length <= 1024
              ? newMessage.content
              : "Length is above 1024, this is a [limit by Discord](https://discord.com/developers/docs/resources/channel#embed-object-embed-limits), we are working on an solution to this problem."
          }`,
        },
      ]);

    await auditLogger(guild, embed);
  },
};

import { CommandInteraction, MessageEmbed } from "discord.js";
import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";
import logger from "@logger";
import prisma from "@root/database/prisma";

export default async (interaction: CommandInteraction) => {
  // Destructure
  const { client, options, user, guild } = interaction;

  // Target information
  const target = options?.getUser("target");

  // Discord User Information
  const discordUser = await client?.users?.fetch(
    `${target ? target?.id : user?.id}`
  );

  if (guild === null) {
    return logger?.verbose(`Guild is null`);
  }

  // User Information
  const guildMemberData = await prisma.guildMember.findUnique({
    where: {
      guildId_userId: {
        guildId: guild?.id,
        userId: discordUser?.id,
      },
    },
  });

  if (!guildMemberData) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: `${discordUser?.username}#${discordUser?.discriminator}`,
            iconURL: discordUser?.displayAvatarURL(),
          })
          .setDescription(
            `We can not find your requested to user in our database!`
          )
          .setTimestamp(new Date())
          .setColor(errorColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });

    return;
  }

  // Embed object
  const embed = {
    author: {
      name: `${discordUser?.username}#${discordUser?.discriminator}`,
      icon_url: discordUser?.displayAvatarURL(),
    },
    color: successColor,
    fields: [
      {
        name: `:dollar: Credits`,
        value: `${guildMemberData?.credits || "Not found"}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Level`,
        value: `${guildMemberData?.level || "Not found"}`,
        inline: true,
      },
      {
        name: `:squeeze_bottle: Points`,
        value: `${guildMemberData?.points || "Not found"}`,
        inline: true,
      },
      {
        name: `:loudspeaker: Reputation`,
        value: `${guildMemberData?.reputation || "Not found"}`,
        inline: true,
      },
      {
        name: `:rainbow_flag: Language`,
        value: `${guildMemberData?.locale || "Not found"}`,
        inline: true,
      },
    ],
    timestamp: new Date(),
    footer: {
      iconURL: footerIcon,
      text: footerText,
    },
  };

  // Return interaction reply
  return interaction?.editReply({ embeds: [embed] });
};

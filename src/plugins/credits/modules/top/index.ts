// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

// Helpers
import pluralize from "@helpers/pluralize";

import prisma from "@root/database/prisma";

import logger from "@logger";
import i18next from "i18next";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("top").setDescription(`View the top users`);
  },
  execute: async (interaction: CommandInteraction) => {
    // Get all users in the guild

    const guildMemberData = await prisma.guildMember.findMany({
      where: { guildId: interaction?.guild?.id },
      orderBy: { credits: "desc" },
      select: { userId: true, credits: true },
    });

    logger.silly(guildMemberData);

    // Create entry object
    const entry = (x: any, index: number) =>
      `${index + 1}. <@${x.userId}> - ${pluralize(x.credits, "credit")}`;

    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(i18next.t("plugins:credits:modules:top:general:title"))
          .setDescription(
            `Top 10 users with the most credits.

            ${guildMemberData.map(entry).join("\n")}`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  },
};

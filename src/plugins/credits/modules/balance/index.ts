// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

import logger from "@logger";

// Configurations
import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Helpers
import pluralize from "@helpers/pluralize";

import prisma from "@root/database/prisma";
import i18next from "i18next";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return (
      command
        .setName("balance")
        .setDescription(`View a user's balance`)

        // User
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription(`The user whose balance you want to view`)
        )
    );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, user, guild } = interaction;

    const discordUser = options?.getUser("user");

    if (guild === null) {
      logger?.verbose(`Guild is null`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:credits:modules:balance:general:title")
            )
            .setDescription(`You can only use this command in a guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const targetUser = discordUser || user;

    const guildMemberData = await prisma.guildMember.upsert({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: targetUser.id,
        },
      },
      update: {},
      create: {
        guildId: guild.id,
        userId: targetUser.id,
        credits: 0,
      },
    });

    if (guildMemberData === null) {
      logger?.verbose(`User not found`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:credits:modules:balance:general:title")
            )
            .setDescription(`Could not find user ${discordUser || user}`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (guildMemberData.credits === null) {
      logger?.verbose(`User has no credits`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:credits:modules:balance:general:title")
            )
            .setDescription(`${discordUser || user} has no credits!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    logger?.verbose(`Found user ${discordUser || user}`);

    return interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(i18next.t("plugins:credits:modules:balance:general:title"))
          .setDescription(
            `${discordUser || user} has  ${pluralize(
              guildMemberData.credits,
              `credit`
            )}!`
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  },
};

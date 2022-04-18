import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import i18next from "i18next";

import {
  successColor,
  errorColor,
  footerText,
  footerIcon,
} from "@config/embed";

import { timeout } from "@config/reputation";

import logger from "@logger";
import timeoutSchema from "@schemas/timeout";
import prisma from "@root/database/prisma";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("give")
      .setDescription("Give reputation to a user")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to repute.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("What type of reputation you want to repute")
          .setRequired(true)
          .addChoice("Positive", "positive")
          .addChoice("Negative", "negative")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure
    const { options, user, guild } = interaction;

    // Target option
    const optionTarget = options?.getUser("target");

    // Type information
    const optionType = options?.getString("type");

    if (guild === null) {
      return logger?.verbose(`Guild is null`);
    }

    // Check if user has a timeout
    const isTimeout = await timeoutSchema?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-04-10-16-42",
    });

    // If user is not on timeout
    if (isTimeout) {
      logger?.verbose(`User is on timeout`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:reputation:modules:give:general:title")
            )
            .setDescription(
              i18next.t("plugins:reputation:modules:give:error01:description", {
                timeout,
              })
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // Do not allow self reputation
    if (optionTarget?.id === user?.id) {
      logger?.verbose(`User is trying to give reputation to self`);

      return interaction?.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:reputation:modules:give:general:title")
            )
            .setDescription(
              i18next.t("plugins:reputation:modules:give:error02:description")
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (optionTarget === null) return;

    const guildMemberData = await prisma.guildMember.findUnique({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: optionTarget.id,
        },
      },
    });

    if (!guildMemberData) {
      await interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(
              i18next.t("plugins:reputation:modules:give:general:title")
            )
            .setDescription(
              i18next.t("plugins:reputation:modules:give:error03:description")
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });

      return;
    }

    // If type is positive
    if (optionType === "positive") {
      await prisma.guildMember
        .update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: optionTarget.id,
            },
          },
          data: { reputation: { increment: 1 } },
        })
        .then(async (result) => {
          logger.silly(result);
        })
        .catch(async (error) => {
          logger.error(error);
        });
    }

    // If type is negative
    if (optionType === "negative") {
      await prisma.guildMember
        .update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: optionTarget.id,
            },
          },
          data: { reputation: { decrement: 1 } },
        })
        .then(async (result) => {
          logger.silly(result);
        })
        .catch(async (error) => {
          logger.error(error);
        });
    }

    await timeoutSchema?.create({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-04-10-16-42",
    });

    interaction?.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(i18next.t("plugins:reputation:modules:give:general:title"))
          .setDescription(
            i18next.t("plugins:reputation:modules:give:success01:description", {
              optionTarget,
            })
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });

    setTimeout(async () => {
      logger?.verbose(`Removing timeout`);

      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-04-10-16-42",
      });
    }, timeout);
  },
};

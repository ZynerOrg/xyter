// Dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Configurations
import {
  errorColor,
  successColor,
  footerText,
  footerIcon,
} from "@config/embed";

// Handlers
import logger from "@logger";

// Models
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

import prisma from "@root/database/prisma";
import i18next from "i18next";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("gift")
      .setDescription(`Gift a user credits`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("The user you want to gift credits to.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of credits you want to gift.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("reason").setDescription("Your reason.")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { options, user, guild, client } = interaction;

    const optionUser = options?.getUser("user");
    const optionAmount = options?.getInteger("amount");
    const optionReason = options?.getString("reason");

    if (guild === null) {
      logger?.verbose(`Guild is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(`We can not find your guild!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (optionUser === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(`We can not find your requested user!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    const fromGuildMemberData = await prisma.guildMember.findUnique({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: user.id,
        },
      },
    });

    const toGuildMemberData = await prisma.guildMember.findUnique({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: optionUser.id,
        },
      },
    });

    if (fromGuildMemberData === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(
              `We can not find your requested from user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (toGuildMemberData === null) {
      logger?.verbose(`User not found`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(
              `We can not find your requested to user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If receiver is same as sender
    if (optionUser?.id === user?.id) {
      logger?.verbose(`User is same as sender`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(`You can not pay yourself!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is null
    if (optionAmount === null) {
      logger?.verbose(`Amount is null`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(`We could not read your requested amount!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If amount is zero or below
    if (optionAmount <= 0) {
      logger?.verbose(`Amount is zero or below`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(`You can't gift zero or below!`)
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    if (fromGuildMemberData === null) return;
    if (toGuildMemberData === null) return;
    if (fromGuildMemberData.credits === null) return;
    if (toGuildMemberData.credits === null) return;

    // If user has below gifting amount
    if (fromGuildMemberData.credits < optionAmount) {
      logger?.verbose(`User has below gifting amount`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(
              `You have insufficient credits. Your balance is ${fromGuildMemberData?.credits}!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    // If toGuildMemberData has no credits
    if (toGuildMemberData === null) {
      logger?.verbose(`User has no credits`);

      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:gift:general:title"))
            .setDescription(
              `We can not find your requested to user in our database!`
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }

    await prisma
      .$transaction([
        prisma.guildMember.update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: user.id,
            },
          },
          data: {
            credits: fromGuildMemberData.credits - optionAmount,
          },
        }),

        prisma.guildMember.update({
          where: {
            guildId_userId: {
              guildId: guild.id,
              userId: optionUser.id,
            },
          },
          data: {
            credits: toGuildMemberData.credits + optionAmount,
          },
        }),
      ])
      .then(async () => {
        // Get DM user object
        const dmUser = client?.users?.cache?.get(optionUser?.id);

        // Send DM to user
        await dmUser
          ?.send({
            embeds: [
              new MessageEmbed()
                .setTitle(
                  i18next.t("plugins:credits:modules:gift:general:title")
                )
                .setDescription(
                  `You have received ${optionAmount} credits from ${
                    user?.tag
                  } with reason ${
                    optionReason ? ` with reason: ${optionReason}` : ""
                  }!`
                )
                .setTimestamp(new Date())
                .setColor(successColor)
                .setFooter({ text: footerText, iconURL: footerIcon }),
            ],
          })
          .catch(async (error) =>
            logger?.error(`[Gift] Error sending DM to user: ${error}`)
          );

        logger?.verbose(
          `[Gift] Successfully gifted ${optionAmount} credits to ${optionUser?.tag}`
        );

        return interaction
          .editReply({
            embeds: [
              new MessageEmbed()
                .setTitle(
                  i18next.t("plugins:credits:modules:gift:general:title")
                )
                .setDescription(
                  `Successfully gifted ${optionAmount} credits to ${optionUser?.tag}!`
                )
                .setTimestamp(new Date())
                .setColor(successColor)
                .setFooter({ text: footerText, iconURL: footerIcon }),
            ],
          })
          .catch(async (error) => {
            logger?.error(`[Gift] Error editing interaction: ${error}`);
          });
      })
      .catch(async (error) => {
        logger?.error(`[Gift] Error executing transaction: ${error}`);
      });
  },
};

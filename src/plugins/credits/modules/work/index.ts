import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";
import {
  successColor,
  footerText,
  footerIcon,
  errorColor,
} from "@config/embed";
import logger from "@logger";
import timeoutSchema from "@schemas/timeout";
import prisma from "@root/database/prisma";
import getModule from "@root/helpers/getModule";
import i18next from "i18next";
import { ICreditModule } from "@plugins/credits/interfaces/module";

export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    const { guild, user } = interaction;

    if (!guild) return;

    const module = <ICreditModule>await getModule(guild.id, "credits");

    if (!module) return;

    const chance = new Chance();
    const creditsEarned = chance.integer({
      min: 0,
      max: module.data.workRate,
    });

    const isTimeout = await timeoutSchema?.findOne({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-03-15-19-16",
    });

    if (isTimeout) {
      logger?.verbose(`User ${user?.id} is on timeout`);
      return interaction.editReply({
        embeds: [
          new MessageEmbed()
            .setTitle(i18next.t("plugins:credits:modules:work:general:title"))
            .setDescription(
              i18next.t("plugins:credits:modules:work:error01:description", {
                timeout: module.data.workTimeout,
              })
            )
            .setTimestamp(new Date())
            .setColor(errorColor)
            .setFooter({ text: footerText, iconURL: footerIcon }),
        ],
      });
    }
    const guildMemberData = await prisma.guildMember.upsert({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: user.id,
        },
      },
      update: { credits: { increment: creditsEarned } },
      create: {
        guildId: guild.id,
        userId: user.id,
        credits: creditsEarned,
      },
    });
    logger.silly(guildMemberData);
    logger?.verbose(
      `User ${guildMemberData?.userId} worked and earned ${creditsEarned} credits`
    );
    interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(i18next.t("plugins:credits:modules:work:general:title"))
          .setDescription(
            i18next.t("plugins:credits:modules:work:success01:description", {
              amount: creditsEarned,
            })
          )
          .setTimestamp(new Date())
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
    await timeoutSchema?.create({
      guildId: guild?.id,
      userId: user?.id,
      timeoutId: "2022-03-15-19-16",
    });
    setTimeout(async () => {
      logger?.verbose(`Removing timeout for user ${user?.id}`);
      await timeoutSchema?.deleteOne({
        guildId: guild?.id,
        userId: user?.id,
        timeoutId: "2022-03-15-19-16",
      });
    }, module.data.workTimeout);
  },
};

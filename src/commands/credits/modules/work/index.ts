// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";
import { CommandInteraction, EmbedBuilder } from "discord.js";
// Models
import * as cooldown from "../../../../handlers/cooldown";
// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedData";
// Helpers
// Handlers
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, true);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure member
    const { guild, user } = interaction;

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Work")
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    // Chance module
    const chance = new Chance();

    if (guild === null) {
      return logger?.silly(`Guild is null`);
    }

    const createGuild = await prisma.guild.upsert({
      where: {
        id: guild.id,
      },
      update: {},
      create: {
        id: guild.id,
      },
    });

    logger.silly(createGuild);

    await cooldown.command(interaction, createGuild.creditsWorkTimeout);

    const creditsEarned = chance.integer({
      min: 0,
      max: createGuild.creditsWorkRate,
    });

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: user.id,
          guildId: guild.id,
        },
      },
      update: { creditsEarned: { increment: creditsEarned } },
      create: {
        creditsEarned,
        user: {
          connectOrCreate: {
            create: {
              id: user.id,
            },
            where: {
              id: user.id,
            },
          },
        },
        guild: {
          connectOrCreate: {
            create: {
              id: guild.id,
            },
            where: {
              id: guild.id,
            },
          },
        },
      },
      include: {
        user: true,
        guild: true,
      },
    });

    logger.silly(createGuildMember);

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(`You worked and earned ${creditsEarned} credits.`)
          .setColor(successColor),
      ],
    });
  },
};

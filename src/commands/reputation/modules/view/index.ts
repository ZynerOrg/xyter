import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription("View a user's reputation value")
      .addUserOption((option) =>
        option
          .setName("target")
          .setDescription("The user you want to check.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    const { options, guild } = interaction;

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      guild
    );

    const optionTarget = options?.getUser("target");

    if (!guild) throw new Error("Guild is undefined");
    if (!optionTarget) throw new Error("Target is not defined");

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: optionTarget.id,
          guildId: guild.id,
        },
      },
      update: {},
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: optionTarget.id,
            },
            where: {
              id: optionTarget.id,
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

    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:loudspeaker:] View")
      .setDescription(
        `${optionTarget} has ${createGuildMember.user.reputationsEarned}.`
      )
      .setTimestamp()
      .setColor(successColor)
      .setFooter({ text: footerText, iconURL: footerIcon });

    await interaction.editReply({
      embeds: [interactionEmbed],
    });
  },
};

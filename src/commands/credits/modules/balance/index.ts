import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("balance")
      .setDescription(`View a user's balance`)
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription(`The user whose balance you want to view`)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, true);

    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { options, user, guild } = interaction;

    const discordUser = options.getUser("user");

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Balance")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.silly(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed.setDescription("Guild is not found").setColor(errorColor),
        ],
      });
    }

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: (discordUser || user).id,
          guildId: guild.id,
        },
      },
      update: {},
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: (discordUser || user).id,
            },
            where: {
              id: (discordUser || user).id,
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

    if (!createGuildMember) throw new Error("No guild member exists.");

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `${discordUser || user} currently has ${
              createGuildMember.creditsEarned
            } credits.`
          )
          .setColor(successColor),
      ],
    });
  },
};

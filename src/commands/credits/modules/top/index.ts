import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { GuildMember } from "@prisma/client";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export default {
  metadata: { guildOnly: true, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("top").setDescription(`View the top users`);
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, false);

    const { errorColor, successColor, footerText, footerIcon } =
      await getEmbedConfig(interaction.guild);
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Top")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    if (guild === null) {
      logger.silly(`Guild is null`);

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(
              "Guild is not found. Please try again with a valid guild."
            )
            .setColor(errorColor),
        ],
      });
    }

    // const usersDB = await userSchema.find({ guildId: guild.id });

    const topTen = await prisma.guildMember.findMany({
      where: {
        guildId: guild.id,
      },
      orderBy: {
        creditsEarned: "desc",
      },
      take: 10,
    });

    logger.silly(topTen);

    // Create entry object
    const entry = (guildMember: GuildMember, index: number) =>
      `${index + 1}. <@${guildMember.userId}> - ${
        guildMember.creditsEarned
      } credits`;

    return interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `Below are the top ten members in this guild.

            ${topTen.map(entry).join("\n")}`
          )
          .setColor(successColor),
      ],
    });
  },
};

import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import prisma from "../../../../../prisma";

export default {
  metadata: { guildOnly: true, ephemeral: false },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("view")
      .setDescription(`View a guild counter`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription(
            `The channel that contains the counter you want to view`
          )
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },

  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const discordChannel = options.getChannel("channel");

    if (!guild) throw new Error(`Guild not found`);
    if (!discordChannel) throw new Error(`Channel not found`);

    const embed = new EmbedBuilder()
      .setTitle("[:1234:] Counters (View)")
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    const channelCounter = await prisma.guildCounter.findUnique({
      where: {
        guildId_channelId: {
          guildId: guild.id,
          channelId: discordChannel.id,
        },
      },
    });

    if (!channelCounter) throw new Error("No counter found for channel");

    await interaction.editReply({
      embeds: [
        embed
          .setDescription(
            `Viewing counter for channel ${discordChannel}: ${channelCounter.count}!`
          )
          .setColor(successColor),
      ],
    });
    return;
  },
};

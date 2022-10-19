// Dependencies
// Models
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
// Configurations
import getEmbedConfig from "../../../../../../../helpers/getEmbedData";
import prisma from "../../../../../../../prisma";

// Function
export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("remove")
      .setDescription(`Delete a counter from your guild.`)
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to delete the counter from.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { options, guild } = interaction;

    const discordChannel = options?.getChannel("channel");

    if (!guild) throw new Error("We could not find a guild");
    if (!discordChannel) throw new Error("We could not find a channel");

    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Counters - Remove")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    const channelCounter = await prisma.guildCounter.findUnique({
      where: {
        guildId_channelId: {
          guildId: guild.id,
          channelId: discordChannel.id,
        },
      },
    });

    if (!channelCounter)
      throw new Error(
        "There is no counter sin this channel, please add one first."
      );

    const deleteGuildCounter = await prisma.guildCounter.deleteMany({
      where: {
        guildId: guild.id,
        channelId: discordChannel.id,
      },
    });

    if (!deleteGuildCounter)
      throw new Error("We could not find a counter for this guild");

    await interaction?.editReply({
      embeds: [
        embed
          .setDescription(":white_check_mark: Counter deleted successfully.")
          .setColor(successColor),
      ],
    });
  },
};

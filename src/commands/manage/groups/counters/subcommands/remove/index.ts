// Dependencies
// Models
import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import checkPermission from "../../../../../../helpers/checkPermission";
import deferReply from "../../../../../../helpers/deferReply";
// Configurations
import prisma from "../../../../../../handlers/prisma";
import getEmbedConfig from "../../../../../../helpers/getEmbedConfig";

// Function
export const builder = (command: SlashCommandSubcommandBuilder) => {
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
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

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

  const channelCounter = await prisma.guildCounters.findUnique({
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

  const deleteGuildCounter = await prisma.guildCounters.deleteMany({
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
};

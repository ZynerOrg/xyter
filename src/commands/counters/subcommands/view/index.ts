import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/prisma";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";

export const builder = (command: SlashCommandSubcommandBuilder) => {
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
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, false);

  const { options, guild } = interaction;
  if (!guild) throw new Error(`Guild not found`);
  if (!options) throw new Error(`Options not found`);

  const discordChannel = options.getChannel("channel");
  if (!discordChannel) throw new Error(`Channel not found`);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":1234:︱View")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  const channelCounter = await prisma.guildCounters.findUnique({
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
      embedSuccess.setDescription(
        `Viewing counter for channel ${discordChannel}: ${channelCounter.count}!`
      ),
    ],
  });
};

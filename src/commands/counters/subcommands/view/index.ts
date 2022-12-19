import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";

// 1. Create builder function.
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

// 2. Create execute function.
export const execute = async (interaction: ChatInputCommandInteraction) => {
  // 1. Defer reply as permanent.
  await deferReply(interaction, false);

  // 2. Destructure interaction object
  const { options, guild } = interaction;
  if (!guild) throw new Error(`Guild not found`);
  if (!options) throw new Error(`Options not found`);

  // 3. Get options
  const discordChannel = options.getChannel("channel");
  if (!discordChannel) throw new Error(`Channel not found`);

  // 4. Create base embeds.
  const EmbedSuccess = await BaseEmbedSuccess(guild, "[:1234:] View");

  // 5. Get counter from database.
  const channelCounter = await prisma.guildCounters.findUnique({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: discordChannel.id,
      },
    },
  });
  if (!channelCounter) throw new Error("No counter found for channel");

  // 6. Send embed.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        `Viewing counter for channel ${discordChannel}: ${channelCounter.count}!`
      ),
    ],
  });
};

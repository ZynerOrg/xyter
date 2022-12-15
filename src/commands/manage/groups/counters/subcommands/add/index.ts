// Dependencies
import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../../../handlers/deferReply";
import checkPermission from "../../../../../../helpers/checkPermission";
// Configurations
import prisma from "../../../../../../handlers/database";
import getEmbedConfig from "../../../../../../helpers/getEmbedData";
import logger from "../../../../../../middlewares/logger";

// Function
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("add")
    .setDescription("Add a counter to your guild.")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the counter to.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("The word to use for the counter.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("start")
        .setDescription("The starting value of the counter.")
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
  const triggerWord = options?.getString("word");
  const startValue = options?.getNumber("start");

  if (!guild) throw new Error("We could not find a guild");
  if (!discordChannel) throw new Error("We could not find a channel");
  if (!triggerWord) throw new Error("We could not find a word");

  const channelCounter = await prisma.guildCounter.findUnique({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: discordChannel.id,
      },
    },
  });

  if (channelCounter)
    throw new Error("A counter already exists for this channel.");

  const createGuildCounter = await prisma.guildCounter.upsert({
    where: {
      guildId_channelId: {
        guildId: guild.id,
        channelId: discordChannel.id,
      },
    },
    update: {},
    create: {
      channelId: discordChannel.id,
      triggerWord,
      count: startValue || 0,
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
  });

  logger.silly(createGuildCounter);

  if (createGuildCounter) {
    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Counters - Add")
      .setTimestamp(new Date())
      .setFooter({ text: footerText, iconURL: footerIcon });

    await interaction?.editReply({
      embeds: [
        embed
          .setDescription(":white_check_mark: Counter created successfully.")
          .setColor(successColor),
      ],
    });
  }
};

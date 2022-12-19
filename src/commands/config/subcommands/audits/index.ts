import {
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import checkPermission from "../../../../helpers/checkPermission";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("audits")
    .setDescription("Audits")
    .addBooleanOption((option) =>
      option
        .setName("status")
        .setDescription("Should audits be enabled?")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel for audit messages.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { guild, options } = interaction;
  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);
  const status = options.getBoolean("status");
  const channel = options.getChannel("channel");

  if (!guild) throw new Error("Guild not found.");
  if (!channel) throw new Error("Channel not found.");
  if (status === null) throw new Error("Status not found.");

  const createGuild = await prisma.guildConfigAudits.upsert({
    where: {
      id: guild.id,
    },
    update: {
      status: status,
      channelId: channel.id,
    },
    create: {
      id: guild.id,
      status: status,
      channelId: channel.id,
    },
  });

  logger.silly(createGuild);

  const embedSuccess = new EmbedBuilder()
    .setTitle("[:hammer:] Audits")
    .setDescription("Guild configuration updated successfully.")
    .setColor(successColor)
    .addFields(
      {
        name: "🤖 Status",
        value: `${
          createGuild.status ? ":white_check_mark: Enabled" : ":x: Disabled"
        }`,
        inline: true,
      },
      {
        name: "🌊 Channel",
        value: `<#${createGuild.channelId}>`,
        inline: true,
      }
    )
    .setTimestamp()
    .setFooter({
      iconURL: footerIcon,
      text: footerText,
    });

  await interaction.editReply({
    embeds: [embedSuccess],
  });
  return;
};

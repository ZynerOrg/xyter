import {
  channelMention,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/prisma";
import checkPermission from "../../../../helpers/checkPermission";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("audits")
    .setDescription("Configure audits module")
    .addBooleanOption((option) =>
      option.setName("status").setDescription("Module status").setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Log channel")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { guild, options } = interaction;
  if (!guild) throw new Error("Guild unavailable");

  const status = options.getBoolean("status");
  const channel = options.getChannel("channel");
  if (status === null) throw new Error("Status must be set");
  if (!channel) throw new Error("Channel unavailable");

  const upsertGuildConfigAudits = await prisma.guildConfigAudits.upsert({
    where: {
      id: guild.id,
    },
    update: {
      status,
      channelId: channel.id,
    },
    create: {
      id: guild.id,
      status,
      channelId: channel.id,
    },
  });

  logger.silly(upsertGuildConfigAudits);

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":gear:︱Configuration of Audits")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  await interaction.editReply({
    embeds: [
      embedSuccess
        .setDescription("Configuration updated successfully!")
        .addFields(
          {
            name: "Status",
            value: `${upsertGuildConfigAudits.status ? "Enabled" : "Disabled"}`,
            inline: true,
          },
          {
            name: "Channel",
            value: `${channelMention(upsertGuildConfigAudits.channelId)}`,
            inline: true,
          }
        ),
    ],
  });
  return;
};

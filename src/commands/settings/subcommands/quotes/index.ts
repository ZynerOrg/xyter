import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/prisma";
import checkPermission from "../../../../utils/checkPermission";
import deferReply from "../../../../utils/deferReply";
import { GuildNotFoundError } from "../../../../utils/errors";
import sendResponse from "../../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("quotes")
    .setDescription("Configure quotes module")
    .addBooleanOption((option) =>
      option.setName("status").setDescription("Status").setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("channel").setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, options, user } = interaction;

  await deferReply(interaction, true);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);
  if (!guild) throw new GuildNotFoundError();

  const quoteStatus = options.getBoolean("status", true);
  const quoteChannel = options.getChannel("channel", true);

  const upsertGuildQuotesSettings = await prisma.guildQuotesSettings.upsert({
    where: {
      id: guild.id,
    },
    update: {
      quoteChannelId: quoteChannel.id,
      status: quoteStatus,
    },
    create: {
      id: guild.id,
      quoteChannelId: quoteChannel.id,
      status: quoteStatus,
      guildSettings: {
        connectOrCreate: {
          where: {
            id: guild.id,
          },
          create: {
            id: guild.id,
          },
        },
      },
    },
  });

  const embedSuccess = new EmbedBuilder()
    .setAuthor({
      name: "Configuration of Quotes",
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setFooter({
      text: `Successfully configured by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    })
    .setTimestamp();

  await sendResponse(interaction, {
    embeds: [
      embedSuccess
        .setDescription("Configuration updated successfully!")
        .addFields({
          name: "Status",
          value: `${upsertGuildQuotesSettings.status}`,
          inline: true,
        })
        .addFields({
          name: "Channel ID",
          value: `${upsertGuildQuotesSettings.quoteChannelId}`,
          inline: true,
        }),
    ],
  });
};

// Dependencies
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { ButtonStyle, ChannelType } from "discord-api-types/v10";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import encryption from "../../../../../../helpers/encryption";
// Configurations
import prisma from "../../../../../../handlers/database";
import deferReply from "../../../../../../handlers/deferReply";
import checkPermission from "../../../../../../helpers/checkPermission";
import getEmbedConfig from "../../../../../../helpers/getEmbedData";
import logger from "../../../../../../middlewares/logger";

// Function
export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("giveaway")
      .setDescription("Giveaway some credits for specified amount of users.")
      .addIntegerOption((option) =>
        option
          .setName("uses")
          .setDescription("How many users should be able to use this.")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("credit")
          .setDescription(`How much credits provided per use.`)
          .setRequired(true)
      )
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("The channel to send the message to.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure
    const { guild, user, options } = interaction;

    const uses = options?.getInteger("uses");
    const creditAmount = options?.getInteger("credit");
    const channel = options?.getChannel("channel");

    if (!uses) throw new Error("Amount of uses is required.");
    if (!creditAmount) throw new Error("Amount of credits is required.");
    if (!channel) throw new Error("Channel is required.");
    if (!guild) throw new Error("Guild is required.");

    const embed = new EmbedBuilder()
      .setTitle("[:toolbox:] Giveaway")
      .setFooter({ text: footerText, iconURL: footerIcon });

    const code = uuidv4();

    const createGuildMember = await prisma.guildMember.upsert({
      where: {
        userId_guildId: {
          userId: user.id,
          guildId: guild.id,
        },
      },
      update: {},
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: user.id,
            },
            where: {
              id: user.id,
            },
          },
        },
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
      include: {
        user: true,
        guild: true,
      },
    });

    logger.silly(createGuildMember);

    if (
      !createGuildMember.guild.apiCpggUrlIv ||
      !createGuildMember.guild.apiCpggUrlContent
    )
      throw new Error("No API url available");

    if (
      !createGuildMember.guild.apiCpggTokenIv ||
      !createGuildMember.guild.apiCpggTokenContent
    )
      throw new Error("No API token available");

    const url = encryption.decrypt({
      iv: createGuildMember.guild.apiCpggUrlIv,
      content: createGuildMember.guild.apiCpggUrlContent,
    });
    const api = axios?.create({
      baseURL: `${url}/api/`,
      headers: {
        Authorization: `Bearer ${encryption.decrypt({
          iv: createGuildMember.guild.apiCpggTokenIv,
          content: createGuildMember.guild.apiCpggTokenContent,
        })}`,
      },
    });

    const shopUrl = `${url}/store`;

    await api
      .post("vouchers", {
        uses,
        code,
        credits: creditAmount,
        memo: `[GIVEAWAY] ${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
      })
      .then(async () => {
        await interaction.editReply({
          embeds: [
            embed
              .setColor(successColor)
              .setDescription(`Successfully created code: ${code}`),
          ],
        });

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Redeem it here")
            .setStyle(ButtonStyle.Link)
            .setEmoji("🏦")
            .setURL(`${shopUrl}?voucher=${code}`)
        );

        const discordChannel = guild?.channels.cache.get(channel.id);

        if (!discordChannel) return;

        if (discordChannel.type !== ChannelType.GuildText) return;

        discordChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle("[:parachute:] Credits!")
              .addFields([
                {
                  name: "💶 Credits",
                  value: `${creditAmount}`,
                  inline: true,
                },
              ])
              .setDescription(
                `${interaction.user} dropped a voucher for a maximum **${uses}** members!`
              )
              .setColor(successColor),
          ],
          components: [buttons],
        });
      });
  },
};

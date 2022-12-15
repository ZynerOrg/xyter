import axios from "axios";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import encryption from "../../../../helpers/encryption";
import getEmbedData from "../../../../helpers/getEmbedData";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("cpgg")
    .setDescription("Buy cpgg power.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("How much credits you want to withdraw.")
        .setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { errorColor, successColor, footerText, footerIcon } =
    await getEmbedData(interaction.guild);
  const { options, guild, user, client } = interaction;
  const optionAmount = options?.getInteger("amount");
  if (optionAmount === null) {
    logger?.silly(`Amount is null.`);
    const interactionEmbed = new EmbedBuilder()
      .setTitle("[:dollar:] Gift")
      .setDescription("We could not read your requested amount.")
      .setTimestamp()
      .setColor(errorColor)
      .setFooter({ text: footerText, iconURL: footerIcon });
    return interaction?.editReply({
      embeds: [interactionEmbed],
    });
  }
  if (!guild) throw new Error("Guild not found");

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

  const dmUser = client?.users?.cache?.get(user?.id);

  if ((optionAmount || createGuildMember.creditsEarned) < 100)
    throw new Error("You can't withdraw to CPGG below 100 credits.");

  if ((optionAmount || createGuildMember.creditsEarned) > 1000000)
    throw new Error("Amount or user credits is above 1.000.000.");

  if (createGuildMember.creditsEarned < optionAmount)
    throw new Error("You can't withdraw more than you have on your account.");

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

  const code = uuidv4();
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
  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Redeem it here")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🏦")
      .setURL(`${shopUrl}?voucher=${code}`)
  );
  await api
    ?.post("vouchers", {
      uses: 1,
      code,
      credits: optionAmount || createGuildMember.creditsEarned,
      memo: `${interaction?.createdTimestamp} - ${interaction?.user?.id}`,
    })
    ?.then(async () => {
      logger?.silly(`Successfully created voucher.`);
      createGuildMember.creditsEarned -=
        optionAmount || createGuildMember.creditsEarned;

      const updateGuildMember = await prisma.guildMember.update({
        where: {
          userId_guildId: {
            userId: user.id,
            guildId: guild.id,
          },
        },
        data: {
          creditsEarned: {
            decrement: optionAmount || createGuildMember.creditsEarned,
          },
        },
      });

      logger.silly(updateGuildMember);

      if (!interaction.guild) throw new Error("Guild is undefined");
      const dmEmbed = new EmbedBuilder()
        .setTitle("[:shopping_cart:] CPGG")
        .setDescription(
          `This voucher comes from **${interaction.guild.name}**.`
        )
        .setTimestamp()
        .addFields({
          name: "💶 Credits",
          value: `${optionAmount || createGuildMember.creditsEarned}`,
          inline: true,
        })
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });
      await dmUser
        ?.send({
          embeds: [dmEmbed],
          components: [buttons],
        })
        .then(async (msg: Message) => {
          const interactionEmbed = new EmbedBuilder()
            .setTitle("[:shopping_cart:] CPGG")
            .setDescription(`I have sent you the code in [DM](${msg.url})!`)
            .setTimestamp()
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon });
          await interaction?.editReply({
            embeds: [interactionEmbed],
          });
        });
    });
  return true;
};

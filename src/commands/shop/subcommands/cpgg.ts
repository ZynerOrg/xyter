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
import prisma from "../../../handlers/prisma";
import deferReply from "../../../helpers/deferReply";
import getEmbedData from "../../../helpers/getEmbedConfig";
import createVoucher from "../../../modules/cpgg/features/createVoucher";
import credits from "../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("cpgg")
    .setDescription("Buy cpgg power.")
    .addIntegerOption((option) =>
      option
        .setName("withdraw")
        .setDescription("How much credits you want to withdraw.")
        .setRequired(true)
        .setMinValue(100)
        .setMaxValue(999999)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { options, guild, user, client } = interaction;
  await deferReply(interaction, true);
  if (!guild) throw new Error("This command can only be executed in a guild");

  const { successColor, footerText, footerIcon } = await getEmbedData(guild);

  const withdrawAmount = options.getInteger("withdraw");
  if (!withdrawAmount) throw new Error("You must specify a withdraw amount");

  const upsertGuildMemberCredit = await prisma.guildMemberCredit.upsert({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      GuildMember: {
        connectOrCreate: {
          create: {
            userId: user.id,
            guildId: guild.id,
          },
          where: {
            userId_guildId: {
              userId: user.id,
              guildId: guild.id,
            },
          },
        },
      },
    },
  });

  if (withdrawAmount < 100)
    throw new Error(
      "To prevent abuse of the Controlpanel.gg API, you can't withdraw less than 100 credits"
    );

  if (withdrawAmount >= 999999)
    throw new Error(
      "Controlpanel.gg API do not support vouchers withdrawing more than 999.999 credits"
    );

  if (upsertGuildMemberCredit.balance < withdrawAmount)
    throw new Error(
      `You do not have enough credits to withdraw ${withdrawAmount} credits`
    );

  const userDM = await client.users.fetch(user.id);
  const code = uuidv4();
  const { redeemUrl } = await createVoucher(guild, code, withdrawAmount, 1);

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Redeem it here")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🏦")
      .setURL(`${redeemUrl}`)
  );

  await credits.take(guild, user, withdrawAmount);

  const dmEmbed = new EmbedBuilder()
    .setTitle(":shopping_cart:︱CPGG")
    .setDescription(`This voucher was generated in guild: **${guild.name}**.`)
    .setTimestamp()
    .addFields({
      name: "💶 Credits",
      value: `${withdrawAmount || upsertGuildMemberCredit.balance}`,
      inline: true,
    })
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });

  await userDM
    .send({
      embeds: [dmEmbed],
      components: [buttons],
    })
    .then(async (msg: Message) => {
      const interactionEmbed = new EmbedBuilder()
        .setTitle(":shopping_cart:︱CPGG")
        .setDescription(`I have sent you the code in [DM](${msg.url})!`)
        .setTimestamp()
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });

      await interaction.editReply({
        embeds: [interactionEmbed],
      });
    });

  return true;
};

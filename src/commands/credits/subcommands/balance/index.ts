import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/prisma";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("balance")
    .setDescription(`Check balance`)
    .addUserOption((option) =>
      option.setName("target").setDescription(`Account you want to check`)
    );
};

export const execute = async (interaction: CommandInteraction) => {
  await deferReply(interaction, true);

  const { options, user, guild } = interaction;
  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");
  if (!options) throw new Error("Options unavailable");

  const target = options.getUser("target");

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  await upsertGuildMember(guild, user);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":credit_card:︱Balance")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  const upsertGuildMemberCredit = await prisma.guildMemberCredit.upsert({
    where: {
      userId_guildId: {
        userId: (target || user).id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      guildMember: {
        connectOrCreate: {
          create: {
            userId: (target || user).id,
            guildId: guild.id,
          },
          where: {
            userId_guildId: {
              userId: (target || user).id,
              guildId: guild.id,
            },
          },
        },
      },
    },
    include: { guildMember: true },
  });

  logger.silly(upsertGuildMemberCredit);

  await upsertGuildMember(guild, user);

  // 6. Send embed.
  await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        target
          ? `${target} has ${upsertGuildMemberCredit.balance} coins in his account.`
          : `You have ${upsertGuildMemberCredit.balance} coins in your account.`
      ),
    ],
  });
};

import { GuildMemberCredit } from "@prisma/client";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  userMention,
} from "discord.js";

import prisma from "../../../../handlers/prisma";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import logger from "../../../../middlewares/logger";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("top").setDescription(`View the top users`);
};

// 2. Export an execute function.
export const execute = async (interaction: CommandInteraction) => {
  const { guild, client, user } = interaction;

  await deferReply(interaction, false);

  if (!guild) throw new Error("Guild not found");
  if (!client) throw new Error("Client not found");

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  await upsertGuildMember(guild, user);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":credit_card:︱Top")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  const topTen = await prisma.guildMemberCredit.findMany({
    where: {
      guildId: guild.id,
    },
    orderBy: {
      balance: "desc",
    },
    take: 10,
  });
  logger.silly(topTen);

  // 5. Create the top 10 list.
  const entry = (guildMemberCredit: GuildMemberCredit, index: number) =>
    `${index + 1}. ${userMention(guildMemberCredit.userId)} | :coin: ${
      guildMemberCredit.balance
    }`;

  // 6. Send embed
  return interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `The top 10 users in this server are:\n\n${topTen
          .map(entry)
          .join("\n")}`
      ),
    ],
  });
};

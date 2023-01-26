import Chance from "chance";
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import prisma from "../../../../handlers/prisma";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
import cooldown from "../../../../middlewares/cooldown";
import logger from "../../../../middlewares/logger";
import economy from "../../../../modules/credits";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("work").setDescription(`Work to earn credits`);
};

export const execute = async (interaction: CommandInteraction) => {
  const { guild, user, commandId } = interaction;

  await deferReply(interaction, true);

  if (!guild) throw new Error("Guild not found");
  if (!user) throw new Error("User not found");

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  await upsertGuildMember(guild, user);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":credit_card:︱Work")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  const chance = new Chance();

  const createGuild = await prisma.guildConfigCredits.upsert({
    where: {
      id: guild.id,
    },
    update: {},
    create: {
      id: guild.id,
    },
  });
  logger.silly(createGuild);
  if (!createGuild) throw new Error("Guild not found");

  await cooldown(guild, user, commandId, createGuild.workTimeout);

  const creditsEarned = chance.integer({
    min: 0,
    max: createGuild.workRate,
  });

  const upsertGuildMemberResult = await economy.give(
    guild,
    user,
    creditsEarned
  );

  await interaction.editReply({
    embeds: [
      embedSuccess.setDescription(
        `You worked and earned **${creditsEarned}** credits! You now have **${upsertGuildMemberResult.balance}** credits. :tada:`
      ),
    ],
  });
};

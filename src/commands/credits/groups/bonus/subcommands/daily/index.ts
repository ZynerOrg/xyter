import { addDays, startOfDay } from "date-fns";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import CooldownManager from "../../../../../../handlers/CooldownManager";
import CreditsManager from "../../../../../../handlers/CreditsManager";
import prisma from "../../../../../../handlers/prisma";
import generateCooldownName from "../../../../../../helpers/generateCooldownName";
import deferReply from "../../../../../../utils/deferReply";
import {
  GuildNotFoundError,
  UserNotFoundError,
} from "../../../../../../utils/errors";
import sendResponse from "../../../../../../utils/sendResponse";

const cooldownManager = new CooldownManager();
const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("daily").setDescription("Claim your daily treasure!");
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, user } = interaction;

  await deferReply(interaction, false);
  if (!guild) throw new GuildNotFoundError();
  if (!user) throw new UserNotFoundError();

  const guildCreditsSettings = await prisma.guildCreditsSettings.upsert({
    where: { id: guild.id },
    update: {},
    create: { id: guild.id },
  });

  const dailyBonusAmount = guildCreditsSettings.dailyBonusAmount;
  const userEconomy = await creditsManager.give(guild, user, dailyBonusAmount);

  const embed = new EmbedBuilder()
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setAuthor({
      name: "🌟 Daily Treasure Claimed",
    })
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `You've just claimed your daily treasure of **${dailyBonusAmount} credits**! 🎉\nEmbark on an epic adventure and spend your riches wisely.\n\n💰 **Your balance**: ${userEconomy.balance} credits`
    )
    .setFooter({
      text: `Claimed by ${user.username}`,
      iconURL: user.displayAvatarURL() || "",
    })
    .setTimestamp();

  await sendResponse(interaction, { embeds: [embed] });

  await cooldownManager.setCooldown(
    await generateCooldownName(interaction),
    guild,
    user,
    startOfDay(addDays(new Date(), 1))
  );
};

import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/prisma";
import deferReply from "../../../../helpers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedConfig";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("check")
    .setDescription("Check reputation")
    .addUserOption((option) =>
      option
        .setName("account")
        .setDescription("The account you checking")
        .setRequired(false)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { options, guild, user } = interaction;

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const optionAccount = options?.getUser("account");

  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");

  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: (optionAccount || user).id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: (optionAccount || user).id,
          },
          where: {
            id: (optionAccount || user).id,
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

  const reputationType = (reputation: number) => {
    if (reputation < 0) return `negative reputation of ${reputation}`;
    if (reputation > 0) return `positive reputation of ${reputation}`;
    return "neutral reputation";
  };

  const interactionEmbed = new EmbedBuilder()
    .setTitle(
      optionAccount
        ? `:loudspeaker:︱Showing ${optionAccount.username}'s reputation`
        : ":loudspeaker:︱Showing your reputation"
    )
    .setDescription(
      optionAccount
        ? `${optionAccount} have a ${reputationType(
            createGuildMember.user.reputationsEarned
          )}`
        : `You have a ${reputationType(
            createGuildMember.user.reputationsEarned
          )}`
    )
    .setTimestamp()
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon });

  await interaction.editReply({
    embeds: [interactionEmbed],
  });
};

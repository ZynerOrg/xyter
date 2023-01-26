import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../handlers/prisma";
import deferReply from "../../../helpers/deferReply";
import getEmbedConfig from "../../../helpers/getEmbedConfig";
import logger from "../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("check")
    .setDescription("Check reputation")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you are checking")
        .setRequired(false)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { options, guild, user } = interaction;

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const checkUser = options.getUser("user");

  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");

  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: (checkUser || user).id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: (checkUser || user).id,
          },
          where: {
            id: (checkUser || user).id,
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
      checkUser
        ? `:loudspeaker:︱Showing ${checkUser.username}'s reputation`
        : ":loudspeaker:︱Showing your reputation"
    )
    .setDescription(
      checkUser
        ? `${checkUser} have a ${reputationType(
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

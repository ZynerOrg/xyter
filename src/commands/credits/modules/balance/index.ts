import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import logger from "../../../../middlewares/logger";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("balance")
    .setDescription(`Check balance`)
    .addUserOption((option) =>
      option.setName("target").setDescription(`Account you want to check`)
    );
};

// 2. Export an execute function.
export const execute = async (interaction: CommandInteraction) => {
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Destructure interaction object.
  const { options, user, guild } = interaction;
  if (!guild) throw new Error("Server unavailable");
  if (!user) throw new Error("User unavailable");
  if (!options) throw new Error("Options unavailable");

  // 3. Get options from interaction.
  const target = options.getUser("target");

  // 4. Create base embeds.
  const EmbedSuccess = await BaseEmbedSuccess(guild, ":credit_card:︱Balance");

  // 5. Upsert the user in the database.
  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: (target || user).id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      user: {
        connectOrCreate: {
          create: {
            id: (target || user).id,
          },
          where: {
            id: (target || user).id,
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

  // 6. Send embed.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        target
          ? `${target} has ${createGuildMember.creditsEarned} coins in his account.`
          : `You have ${createGuildMember.creditsEarned} coins in your account.`
      ),
    ],
  });
};

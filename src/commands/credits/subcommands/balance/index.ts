import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import upsertGuildMember from "../../../../helpers/upsertGuildMember";
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
  const createGuildMemberCredits = await prisma.guildMemberCredits.upsert({
    where: {
      userId_guildId: {
        userId: (target || user).id,
        guildId: guild.id,
      },
    },
    update: {},
    create: {
      GuildMember: {
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
    include: { GuildMember: true },
  });

  logger.silly(createGuildMemberCredits);

  await upsertGuildMember(guild, user);

  // 6. Send embed.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        target
          ? `${target} has ${createGuildMemberCredits.balance} coins in his account.`
          : `You have ${createGuildMemberCredits.balance} coins in your account.`
      ),
    ],
  });
};

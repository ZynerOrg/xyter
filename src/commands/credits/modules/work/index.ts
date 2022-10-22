import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";
import { CommandInteraction } from "discord.js";

import { command as CooldownCommand } from "../../../../handlers/cooldown";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import logger from "../../../../middlewares/logger";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command.setName("work").setDescription(`Work to earn credits`);
};

// 2. Export an execute function.
export const execute = async (interaction: CommandInteraction) => {
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Destructure interaction object.
  const { guild, user } = interaction;
  if (!guild) throw new Error("Guild not found");
  if (!user) throw new Error("User not found");

  // 3. Create base embeds.
  const EmbedSuccess = await BaseEmbedSuccess(guild, "[:dollar:] Work");

  // 4. Create new Chance instance.
  const chance = new Chance();

  // 5. Upsert the guild in the database.
  const createGuild = await prisma.guild.upsert({
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

  // 6. Create a cooldown for the user.
  await CooldownCommand(interaction, createGuild.creditsWorkTimeout);

  // 6. Generate a random number between 0 and creditsWorkRate.
  const creditsEarned = chance.integer({
    min: 0,
    max: createGuild.creditsWorkRate,
  });

  // 7. Upsert the guildMember in the database.
  const createGuildMember = await prisma.guildMember.upsert({
    where: {
      userId_guildId: {
        userId: user.id,
        guildId: guild.id,
      },
    },
    update: { creditsEarned: { increment: creditsEarned } },
    create: {
      creditsEarned,
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
  if (!createGuildMember) throw new Error("GuildMember not found");

  // 8. Send embed.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        `You worked and earned **${creditsEarned}** credits! You now have **${createGuildMember.creditsEarned}** credits. :tada:`
      ),
    ],
  });
};

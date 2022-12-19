import { Client } from "discord.js";
import logger from "../../../../../middlewares/logger";

import { GuildShopRoles } from "@prisma/client";
import prisma from "../../../../../handlers/database";

// Execute the component
export const execute = async (client: Client, role: GuildShopRoles) => {
  const { guildId, userId, roleId } = role;
  if (!userId) throw new Error("User ID not found for shop role.");

  const rGuild = client.guilds.cache.get(guildId);
  if (!rGuild) throw new Error("Guild not found.");

  const rMember = await rGuild.members.fetch(userId);
  if (!rMember) throw new Error("Member not found.");

  const rRole = rMember.roles.cache.get(roleId);
  if (!rRole) throw new Error("Role not found.");

  logger.debug(`Shop role ${roleId} is due for payment.`);

  const getGuildConfigShopRoles = await prisma.guildConfigShopRoles.findUnique({
    where: {
      id: guildId,
    },
    include: {
      guild: true,
    },
  });

  logger.silly(getGuildConfigShopRoles);

  if (!getGuildConfigShopRoles)
    throw new Error("Could not find guild config shop roles.");

  const getGuildMemberCredits = await prisma.guildMemberCredits.findUnique({
    where: {
      userId_guildId: {
        userId,
        guildId,
      },
    },
    include: {
      GuildMember: true,
    },
  });

  logger.silly(getGuildMemberCredits);

  if (!getGuildMemberCredits) throw new Error("Could not find guild member.");

  const pricePerHour = getGuildConfigShopRoles.pricePerHour;

  if (getGuildMemberCredits.balance < pricePerHour) {
    await rMember.roles
      .remove(roleId)
      .then(async () => {
        const deleteShopRole = await prisma.guildShopRoles.delete({
          where: {
            guildId_userId_roleId: {
              guildId,
              userId,
              roleId,
            },
          },
        });

        logger.silly(deleteShopRole);

        logger.silly(
          `Shop role document ${roleId} has been deleted from user ${userId}.`
        );
      })
      .catch(() => {
        throw new Error(`Failed removing role from user.`);
      });

    throw new Error("User does not have enough credits.");
  }

  const createGuildMember = await prisma.guildMemberCredits.upsert({
    where: {
      userId_guildId: {
        userId,
        guildId,
      },
    },
    update: { balance: { decrement: pricePerHour } },
    create: {
      balance: -pricePerHour,
      GuildMember: {
        connectOrCreate: {
          create: {
            userId,
            guildId,
          },
          where: {
            userId_guildId: {
              userId,
              guildId,
            },
          },
        },
      },
    },
    include: {
      GuildMember: true,
    },
  });

  logger.silly(createGuildMember);

  logger.silly(`User ${userId} has been updated.`);

  const updateGuildShopRole = await prisma.guildShopRoles.update({
    where: {
      guildId_userId_roleId: {
        guildId,
        userId,
        roleId,
      },
    },
    data: {
      lastPayed: new Date(),
    },
  });

  logger.silly(updateGuildShopRole);

  logger.silly(`Shop role ${roleId} has been updated.`);

  logger.debug(`Shop role ${roleId} has been paid.`);
};

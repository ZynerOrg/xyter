import { Client } from "discord.js";
import logger from "../../../../../middlewares/logger";

import { IShopRole } from "../../../../../interfaces/ShopRole";
import guildSchema from "../../../../../models/guild";
import shopRoleSchema from "../../../../../models/shopRole";
import userSchema from "../../../../../models/user";

export const execute = async (client: Client, role: IShopRole) => {
  const { guildId, userId, roleId } = role;
  if (!userId) throw new Error("User ID not found for shop role.");

  const guildData = await guildSchema.findOne({ guildId });
  if (!guildData) throw new Error("Guild not found.");

  const userData = await userSchema.findOne({ guildId, userId });
  if (!userData) throw new Error("User not found.");

  const rGuild = client.guilds.cache.get(guildId);
  if (!rGuild) throw new Error("Guild not found.");

  const rMember = await rGuild.members.fetch(userId);
  if (!rMember) throw new Error("Member not found.");

  const rRole = rMember.roles.cache.get(roleId);
  if (!rRole) throw new Error("Role not found.");

  logger.debug(`Shop role ${roleId} is due for payment.`);

  const { pricePerHour } = guildData.shop.roles;

  if (userData.credits < pricePerHour) {
    await rMember.roles
      .remove(roleId)
      .then(async () => {
        await shopRoleSchema
          .deleteOne({
            userId,
            roleId,
            guildId,
          })
          .then(() => {
            logger.silly(
              `Shop role document ${roleId} has been deleted from user ${userId}.`
            );
          })
          .catch(() => {
            throw new Error("Failed deleting shop role from user.");
          });
      })
      .catch(() => {
        throw new Error(`Failed removing role from user.`);
      });

    throw new Error("User does not have enough credits.");
  }

  userData.credits -= pricePerHour;
  await userData
    .save()
    .then(async () => {
      logger.silly(`User ${userId} has been updated.`);

      role.lastPayed = new Date();
      await role
        .save()
        .then(() => {
          logger.silly(`Shop role ${roleId} has been updated.`);
        })
        .catch(() => {
          throw new Error("Failed updating shop role.");
        });

      logger.debug(`Shop role ${roleId} has been paid.`);
    })
    .catch(() => {
      throw new Error("Failed updating user.");
    });
};

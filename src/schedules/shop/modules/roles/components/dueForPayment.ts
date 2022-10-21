import { Client } from "discord.js";
import logger from "../../../../../middlewares/logger";

import { GuildShopRoles } from "@prisma/client";

export const execute = async (_client: Client, role: GuildShopRoles) => {
  const { roleId } = role;

  logger.silly(`Shop role ${roleId} is not due for payment.`);
};

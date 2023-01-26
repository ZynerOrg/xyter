import { Client } from "discord.js";
import logger from "../../../../../middlewares/logger";

import { GuildShopRoles } from "@prisma/client";

// Execute the dueForPayment function
export const execute = (_client: Client, role: GuildShopRoles) => {
  const { roleId } = role;

  logger.silly(`Shop role ${roleId} is not due for payment.`);
};

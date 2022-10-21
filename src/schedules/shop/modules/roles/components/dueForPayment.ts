import { Client } from "discord.js";
import logger from "../../../../../middlewares/logger";

import { IShopRole } from "../../../../../interfaces/ShopRole";

export const execute = async (_client: Client, role: IShopRole) => {
  const { roleId } = role;

  logger.silly(`Shop role ${roleId} is not due for payment.`);
};

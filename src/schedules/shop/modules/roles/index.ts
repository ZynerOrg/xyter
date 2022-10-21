import { Client } from "discord.js";

import { IShopRole } from "../../../../interfaces/ShopRole";
import shopRoleSchema from "../../../../models/shopRole";

import * as dueForPayment from "./components/dueForPayment";
import * as overDueForPayment from "./components/overDueForPayment";

export const execute = async (client: Client) => {
  const roles = await shopRoleSchema.find();

  await Promise.all(
    roles.map(async (role: IShopRole) => {
      const { lastPayed } = role;
      const nextPayment = new Date(
        lastPayed.setHours(lastPayed.getHours() + 1)
      );

      const now = new Date();

      if (nextPayment > now) {
        await dueForPayment.execute(client, role);

        return;
      }

      if (nextPayment < now) {
        await overDueForPayment.execute(client, role);
      }
    })
  );
};

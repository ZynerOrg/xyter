/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import prisma from "../../../../handlers/database";

import * as dueForPayment from "./components/dueForPayment";
import * as overDueForPayment from "./components/overDueForPayment";

export const execute = async (client: Client) => {
  const roles = await prisma.guildShopRoles.findMany();

  for await (const role of roles) {
    const { lastPayed } = role;
    const nextPayment = new Date(lastPayed.setHours(lastPayed.getHours() + 1));

    const now = new Date();

    if (nextPayment > now) {
      dueForPayment.execute(client, role);

      return;
    }

    if (nextPayment < now) {
      await overDueForPayment.execute(client, role);
    }
  }
};

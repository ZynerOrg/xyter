/* eslint-disable no-loops/no-loops */
import { Client } from "discord.js";
import prisma from "../../../../handlers/database";

import { execute as dueForPaymentExecute } from "./components/dueForPayment";
import { execute as overDueForPaymentExecute } from "./components/overDueForPayment";

// Execute the roles function
export const execute = async (client: Client) => {
  const roles = await prisma.guildShopRoles.findMany();

  for await (const role of roles) {
    const { lastPayed } = role;
    const nextPayment = new Date(lastPayed.setHours(lastPayed.getHours() + 1));

    const now = new Date();

    if (nextPayment > now) {
      dueForPaymentExecute(client, role);

      return;
    }

    if (nextPayment < now) {
      await overDueForPaymentExecute(client, role);
    }
  }
};

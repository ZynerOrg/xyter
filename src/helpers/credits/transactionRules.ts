import { Guild, User } from "discord.js";

export default async (guild: Guild, user: User, amount: number) => {
  // 1. Verify that the amount is not above 100.000.000 credits.
  if (amount > 100000000) {
    throw new Error("You can't give more than 1.000.000 credits.");
  }

  // 2. Verify that the amount is not below 1 credits.
  if (amount <= 0) {
    throw new Error("You can't give below one credit.");
  }

  // 3. Verify that the user is not an bot.
  if (user.bot) {
    throw new Error("You can't give to an bot.");
  }
};

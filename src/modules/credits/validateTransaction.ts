import { Guild, User } from "discord.js";

export default (guild: Guild, user: User, amount: number) => {
  if (!guild) {
    throw new Error("Credits is only available for guilds");
  }

  // 2. Verify that the amount is not below 1 credits.
  if (amount <= 0) {
    throw new Error("You can't make an transaction below 1 credits");
  }

  // 3. Verify that the user is not an bot.
  if (user.bot) {
    throw new Error("Bots cant participate in transactions");
  }
};

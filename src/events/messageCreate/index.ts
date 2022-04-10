import guilds from "../../helpers/database/models/guildSchema";
import users from "../../helpers/database/models/userSchema";
import points from "./modules/points";
import credits from "./modules/credits";
import counter from "./modules/counter";

import { Message } from "discord.js";
export default {
  name: "messageCreate",
  async execute(message: Message) {
    const { guild, author } = message;

    // If message author is bot
    if (author.bot) return;

    // Get guild object
    const guildDB = await guilds.findOne({ guildId: guild?.id });

    // Get guild object
    const userDB = await users.findOne({
      guildId: guild?.id,
      userId: author?.id,
    });

    // Manage credits

    await credits(guildDB, userDB, message);

    // Manage points
    await points(guildDB, userDB, message);

    // Manage counter
    await counter(guildDB, userDB, message);
  },
};

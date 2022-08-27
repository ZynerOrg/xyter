// Dependencies
import { Guild, User } from "discord.js";

// Models
import userSchema from "../../models/user";

// Handlers
import logger from "../../middlewares/logger";

// Function
export default async (user: User, guild: Guild) => {
  const userObj = await userSchema?.findOne({
    userId: user.id,
    guildId: guild.id,
  });
  if (userObj === null) {
    const newUserObj = new userSchema({
      userId: user.id,
      guildId: guild.id,
    });

    await newUserObj
      .save()
      .then(async () => {
        logger?.silly(`Created user: ${user.id} for guild: ${guild.id}`);
      })
      .catch(async (error) => {
        logger?.error(
          `Error creating user: ${user.id} for guild: ${guild.id} - ${error}`
        );
      });

    return newUserObj;
  } else {
    return userObj;
  }
};

import { Guild } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../utils/logger";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (guild: Guild) => {
  try {
    const { user } = await guild.fetchOwner();
    await upsertGuildMember(guild, user);
  } catch (error) {
    logger.error(`Error executing guild member fetch: ${error}`);
    // Handle the error appropriately (e.g., sending an error message, etc.)
  }
};

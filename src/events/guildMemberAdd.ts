import users from "../helpers/database/models/userSchema";
import logger from "../handlers/logger";

import { GuildMember } from "discord.js";

export default {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    await users
      .create({ userId: member?.id, guildId: member?.guild?.id })
      .then(async () =>
        logger.debug(
          `Guild: ${member?.guild?.id} User: ${member?.id} created successfully`
        )
      );
  },
};

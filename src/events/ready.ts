import logger from "../handlers/logger";
import config from "../../config.json";
import deployCommands from "../helpers/deployCommands";
import dbGuildFix from "../helpers/dbGuildFix";
import dbMemberFix from "../helpers/dbMemberFix";

import { Client } from "discord.js";
export default {
  name: "ready",
  once: true,
  async execute(client: Client) {
    console.log("Test");
    // Send info message
    await logger.info(`Ready! Logged in as ${client?.user?.tag}`);

    // Set client status
    await client?.user?.setPresence({
      activities: [
        { type: "WATCHING", name: `${client.guilds.cache.size} guilds` },
      ],
      status: "online",
    });

    if (config.importToDB) {
      const guilds = client.guilds.cache;
      await guilds.map(async (guild) => {
        await guild?.members.fetch().then(async (members) => {
          await members.forEach(async (member) => {
            const { user } = member;
            dbMemberFix(user, guild);
          });
        });
        await dbGuildFix(guild);
      });
    }

    await deployCommands();
  },
};

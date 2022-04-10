import { Guild } from "discord.js";
import dbGuildFix from "../helpers/dbGuildFix";
import dbMemberFix from "../helpers/dbMemberFix";

export default {
  name: "guildCreate",
  async execute(guild: Guild) {
    // Destructure client
    const { client } = guild;

    await guild.members.fetch().then(async (members) => {
      members.forEach(async (member) => {
        const { user } = member;

        dbMemberFix(user, guild);
      });
    });
    await dbGuildFix(guild);

    // Set client status
    client?.user?.setPresence({
      activities: [
        { type: "WATCHING", name: `${client?.guilds?.cache?.size} guilds` },
      ],
      status: "online",
    });
  },
};

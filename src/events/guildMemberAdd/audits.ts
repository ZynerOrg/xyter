import { EmbedBuilder, GuildMember } from "discord.js";
import auditLogger from "../../helpers/auditLogger";

export default {
  execute: async (member: GuildMember) => {
    const { guild } = member;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Member Joined",
        iconURL: member.displayAvatarURL(),
      })

      .setDescription(`${member.user} - (${member.user.tag})`)
      .addFields([
        {
          name: "Account Age",
          value: `${member.user.createdAt}`,
        },
      ]);

    await auditLogger(guild, embed);
  },
};

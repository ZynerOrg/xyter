import logger from "../../../middlewares/logger";
import { GuildMember, MessageEmbed } from "discord.js";

import guildSchema from "../../../models/guild";

import getEmbedConfig from "../../../helpers/getEmbedConfig";

export default {
  execute: async (member: GuildMember) => {
    const { client, guild } = member;

    const guildData = await guildSchema.findOne({ guildId: member.guild.id });
    if (!guildData) {
      throw new Error("Could not find guild");
    }
    if (guildData.audits.status !== true) return;
    if (!guildData.audits.channelId) {
      throw new Error("Channel not found");
    }

    const embedConfig = await getEmbedConfig(guild);

    const channel = client.channels.cache.get(guildData.audits.channelId);
    if (channel?.type !== "GUILD_TEXT") {
      throw new Error("Channel must be a text channel");
    }

    const embed = new MessageEmbed()
      .setTimestamp(new Date())
      .setAuthor({
        name: "Member Left",
        iconURL: client.user?.displayAvatarURL(),
      })
      .setFooter({
        text: embedConfig.footerText,
        iconURL: embedConfig.footerIcon,
      });

    channel
      .send({
        embeds: [
          embed
            .setColor(embedConfig.errorColor)
            .setDescription(`${member.user} - (${member.user.tag})`)
            .addFields([
              {
                name: "Account Age",
                value: `${member.user.createdAt}`,
              },
            ]),
        ],
      })
      .then(async () => {
        logger.debug(
          `Audit log sent for event guildMemberRemove in guild ${member.guild.name} (${member.guild.id})`
        );
      })
      .catch(async () => {
        throw new Error("Audit log failed to send");
      });
  },
};

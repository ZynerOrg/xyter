/* eslint-disable no-loops/no-loops */
import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../handlers/deferReply";
import getEmbedConfig from "../../../../helpers/getEmbedData";
import cooldown from "../../../../middlewares/cooldown";

export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("stats").setDescription("Check bot statistics!)");
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, false);

    if (!interaction.guild) throw new Error("You need to be in a guild");

    await cooldown(
      interaction.guild,
      interaction.user,
      interaction.commandId,
      3600
    );

    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const { client } = interaction;
    if (client?.uptime === null) return;
    let totalSeconds = client?.uptime / 1000;
    const days = Math?.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    const hours = Math?.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math?.floor(totalSeconds / 60);
    const seconds = Math?.floor(totalSeconds % 60);

    const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    // Initialize a storage for the user ids
    const userIds = new Set();
    // Iterate over all guilds (always cached)
    for (const guild of client.guilds.cache.values()) {
      // Fetch all guild members and iterate over them
      for (const member of (await guild.members.fetch()).values()) {
        // Fetch the user, if user already cached, returns value from cache
        // Will probably always return from cache
        const user = await client.users.fetch(member.id);
        // Check if user id is not already in set and user is not a bot
        if (!userIds.has(user.id) && !user.bot) {
          // Add unique user id to our set
          userIds.add(user.id);
        }
      }
    }

    const interactionEmbed = new EmbedBuilder()
      .setColor(successColor)
      .setTitle("[:hammer:] Stats")
      .setDescription(
        "Below you can see a list of statistics about this bot instance."
      )
      .setTimestamp()
      .addFields(
        {
          name: "⏰ Latency",
          value: `${Date?.now() - interaction?.createdTimestamp} ms`,
          inline: true,
        },
        {
          name: "⏰ API Latency",
          value: `${Math?.round(client?.ws?.ping)} ms`,
          inline: true,
        },
        {
          name: "⏰ Uptime",
          value: `${uptime}`,
          inline: false,
        },
        {
          name: "📈 Guilds",
          value: `${client?.guilds?.cache?.size}`,
          inline: true,
        },
        {
          name: "📈 Users (unique)",
          value: `${userIds.size}`,
          inline: true,
        },
        {
          name: "🤖 Running Version",
          value: `[${process.env.npm_package_version}](https://github.com/ZynerOrg/xyter/releases/tag/${process.env.npm_package_version})`,
          inline: true,
        }
      )
      .setFooter({ text: footerText, iconURL: footerIcon });

    interaction?.editReply({ embeds: [interactionEmbed] });
  },
};

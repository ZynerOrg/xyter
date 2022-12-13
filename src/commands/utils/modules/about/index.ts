/* eslint-disable no-loops/no-loops */
// Dependencies
import { formatDuration, intervalToDuration, subMilliseconds } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../handlers/deferReply";
// Configurations
import getEmbedConfig from "../../../../helpers/getEmbedData";

// Function
export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("about")
      .setDescription("Check information about this instance");
  },
  execute: async (interaction: CommandInteraction) => {
    await deferReply(interaction, false);

    if (!interaction.guild) throw new Error("You need to be in a guild");

    const { client } = interaction;

    // await cooldown(
    //   interaction.guild,
    //   interaction.user,
    //   interaction.commandId,
    //   3600
    // );

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

    // // Initialize a storage for the user ids
    // const userIds = new Set();
    // // Iterate over all guilds (always cached)
    // for await (const guild of client.guilds.cache.values()) {
    //   // Fetch all guild members and iterate over them
    //   for await (const member of (await guild.members.fetch()).values()) {
    //     // Fetch the user, if user already cached, returns value from cache
    //     // Will probably always return from cache
    //     const user = await client.users.fetch(member.id);
    //     // Check if user id is not already in set and user is not a bot
    //     if (!userIds.has(user.id) && !user.bot) {
    //       // Add unique user id to our set
    //       userIds.add(user.id);
    //     }
    //   }
    // }

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setEmoji("💬")
        .setURL("https://discord.zyner.org"),
      new ButtonBuilder()
        .setLabel("Documentation")
        .setStyle(ButtonStyle.Link)
        .setEmoji("📚")
        .setURL("https://xyter.zyner.org")
    );

    const interactionEmbed = new EmbedBuilder()
      .setColor(successColor)
      .setTitle(":toolbox:︱About this instance")
      .setDescription(
        `This bot instance is hosted by [${process.env.BOT_HOSTER_NAME}](${process.env.BOT_HOSTER_URL}) who might have modified the [source code](https://github.com/ZynerOrg/xyter).`
      )
      .setFields(
        {
          name: "Latency",
          value: `${Math.round(client.ws.ping)} ms`,
          inline: true,
        },
        {
          name: "Servers (cached)",
          value: `${client.guilds.cache.size}`,
          inline: true,
        },
        {
          name: "Users (cached)",
          value: `${client.guilds.cache.reduce(
            (a, g) => a + g.memberCount,
            0
          )}`,
          inline: true,
        },
        {
          name: "Version",
          value: `[${process.env.npm_package_version}](https://github.com/ZynerOrg/xyter/releases/tag/${process.env.npm_package_version})`,
          inline: true,
        },
        {
          name: "Since last restart",
          value: `${formatDuration(
            intervalToDuration({
              start: subMilliseconds(new Date(), client.uptime),
              end: new Date(),
            })
          )}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: footerText, iconURL: footerIcon });

    await interaction.editReply({
      embeds: [interactionEmbed],
      components: [buttons],
    });
  },
};

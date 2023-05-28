import { formatDuration, intervalToDuration, subMilliseconds } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../utils/deferReply";
import sendResponse from "../../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("about")
    .setDescription("Get information about the bot and its hosting");
};

export const execute = async (interaction: CommandInteraction) => {
  await deferReply(interaction, false);

  const { user, guild, client } = interaction;

  if (!guild) {
    throw new Error("This command is only available in guilds");
  }

  const guildCount = client.guilds.cache.size;
  const memberCount = client.guilds.cache.reduce(
    (a, g) => a + g.memberCount,
    0
  );
  const version = process.env.npm_package_version;

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Documentation")
      .setStyle(ButtonStyle.Link)
      .setEmoji("📚")
      .setURL("https://xyter.zyner.org"),
    new ButtonBuilder()
      .setLabel("Discord Server")
      .setStyle(ButtonStyle.Link)
      .setEmoji("💬")
      .setURL("https://discord.zyner.org")
  );

  const uptimeDuration = intervalToDuration({
    start: subMilliseconds(new Date(), client.uptime),
    end: new Date(),
  });
  const uptimeString = formatDuration(uptimeDuration);

  const botDescription = `This bot, developed by [**Zyner**](https://zyner.org), serves **${guildCount}** servers and has a vast user base of **${memberCount}**. The current version is **${version}**, accessible on [**GitHub**](https://github.com/ZynerOrg/xyter). It has been active since the last restart, with an uptime of **${uptimeString}**.`;

  const interactionEmbed = new EmbedBuilder()
    .setDescription(botDescription)
    .setTimestamp()
    .setAuthor({ name: "About Xyter" })
    .setColor(process.env.EMBED_COLOR_SUCCESS)
    .setFooter({
      text: `Requested by ${user.username}`,
      iconURL: user.displayAvatarURL(),
    });

  await sendResponse(interaction, {
    embeds: [interactionEmbed],
    components: [buttons],
  });
};

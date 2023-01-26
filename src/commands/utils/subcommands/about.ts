import { formatDuration, intervalToDuration, subMilliseconds } from "date-fns";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../helpers/deferReply";
import getEmbedConfig from "../../../helpers/getEmbedConfig";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("about")
    .setDescription("Check information about the bot");
};

export const execute = async (interaction: CommandInteraction) => {
  await deferReply(interaction, false);

  if (!interaction.guild)
    throw new Error("This command is only available in guilds");

  const { client } = interaction;

  const { successColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

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
        value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`,
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
};

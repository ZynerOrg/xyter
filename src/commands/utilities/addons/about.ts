import config from "../../../../config.json";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  const interactionEmbed = {
    title: ":hammer: Utilities - About",
    description: `This bot is hosted by ${
      config.hoster.url
        ? `[${config.hoster.name}](${config.hoster.url})`
        : `${config.hoster.name}`
    }, the bot is developed by [Zyner](https://github.com/ZynerOrg)!

    If you are interested in contributing, then just [fork it](https://github.com/ZynerOrg/xyter) yourself, we :heart: Open Source.`,
    color: config.colors.success as any,
    timestamp: new Date(),
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };
  interaction.editReply({ embeds: [interactionEmbed] });
};

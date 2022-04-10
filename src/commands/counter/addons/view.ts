import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import counters from "../../../helpers/database/models/counterSchema";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  try {
    // Destructure member
    const { member } = await interaction;

    // Get options
    const channel = await interaction.options.getChannel("channel");

    const counter = await counters.findOne({
      guildId: interaction?.guild?.id,
      channelId: channel?.id,
    });

    if (!counter) {
      // Create embed object
      const embed = {
        title: "Counter - View",
        description: `${channel} is not a counting channel.`,
        timestamp: new Date(),
        color: config.colors.error as any,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return await interaction.editReply({ embeds: [embed] });
    }

    // Create embed object
    const embed = {
      title: "Counter - View",
      color: config.colors.success as any,
      description: `${channel} is currently at number ${counter.counter}.`,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

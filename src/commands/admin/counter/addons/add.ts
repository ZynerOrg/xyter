import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models
import counters from "../../../../helpers/database/models/counterSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: "Admin",
      color: config.colors.error as any,
      description: "You do not have permission to manage this!",
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const channel = await interaction.options.getChannel("channel");
  const word = await interaction.options.getString("word");
  const start = await interaction.options.getNumber("start");

  if (channel?.type !== "GUILD_TEXT") {
    // Create embed object
    const embed = {
      title: "Admin - Counter",
      description: `That channel is not supported, it needs to be a text channel.`,
      timestamp: new Date(),
      color: config.colors.error as any,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  const counterExist = await counters.findOne({
    guildId: interaction?.guild?.id,
    channelId: channel?.id,
    word,
  });

  if (!counterExist) {
    await counters.create({
      guildId: interaction?.guild?.id,
      channelId: channel?.id,
      word,
      counter: start || 0,
    });
    // Create embed object
    const embed = {
      title: "Admin - Counter",
      description: `${channel} is now counting when hearing word ${word} and it starts at number ${
        start || 0
      }.`,
      timestamp: new Date(),
      color: config.colors.success as any,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send debug message
    await logger.debug(
      `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} added ${channel.id} as a counter using word "${word}" for counting.`
    );

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }
  // Create embed object
  const embed = {
    title: "Admin - Counter",
    description: `${channel} is already a counting channel.`,
    timestamp: new Date(),
    color: config.colors.error as any,
    footer: { iconURL: config.footer.icon, text: config.footer.text },
  };

  // Send interaction reply
  return interaction.editReply({ embeds: [embed] });
};

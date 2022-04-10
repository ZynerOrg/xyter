import { Permissions, CommandInteraction } from "discord.js";
import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";

// Database models
import guilds from "../../../../helpers/database/models/guildSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { guild, user } = interaction;

  // Check permission
  if (!interaction?.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD)) {
    // Create embed object
    const embed = {
      title: ":hammer: Settings - Guild [Credits]",
      color: config.colors.error as any,
      description: `You don't have permission to manage this!`,
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return interaction.editReply({ embeds: [embed] });
  }

  // Get options
  const status = await interaction.options.getBoolean("status");
  const rate = await interaction.options.getNumber("rate");
  const timeout = await interaction.options.getNumber("timeout");
  const minimumLength = await interaction.options.getNumber("minimum-length");
  const workRate = await interaction.options.getNumber("work-rate");
  const workTimeout = await interaction.options.getNumber("work-timeout");

  // Get guild object
  const guildDB = await guilds.findOne({
    guildId: guild?.id,
  });

  // Modify values
  guildDB.credits.status = status !== null ? status : guildDB.credits.status;
  guildDB.credits.rate = rate !== null ? rate : guildDB.credits.rate;
  guildDB.credits.timeout =
    timeout !== null ? timeout : guildDB.credits.timeout;
  guildDB.credits.workRate =
    workRate !== null ? workRate : guildDB.credits.workRate;
  guildDB.credits.workTimeout =
    workTimeout !== null ? workTimeout : guildDB.credits.workTimeout;
  guildDB.credits.minimumLength =
    minimumLength !== null ? minimumLength : guildDB.credits.minimumLength;

  // Save guild
  await guildDB.save().then(async () => {
    // Create embed object
    const embed = {
      title: ":hammer: Settings - Guild [Credits]",
      description: "Following settings is set!",
      color: config.colors.success as any,
      fields: [
        { name: "🤖 Status", value: `${guildDB.credits.status}`, inline: true },
        { name: "📈 Rate", value: `${guildDB.credits.rate}`, inline: true },
        {
          name: "📈 Work Rate",
          value: `${guildDB.credits.workRate}`,
          inline: true,
        },
        {
          name: "🔨 Minimum Length",
          value: `${guildDB.credits.minimumLength}`,
          inline: true,
        },
        {
          name: "⏰ Timeout",
          value: `${guildDB.credits.timeout}`,
          inline: true,
        },
        {
          name: "⏰ Work Timeout",
          value: `${guildDB.credits.workTimeout}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${guild?.id} User: ${user.id} has changed credit details.`
    );
  });
};

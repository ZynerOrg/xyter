import config from "../../../../../config.json";
import logger from "../../../../handlers/logger";
import { CommandInteraction } from "discord.js";
// Database models
import users from "../../../../helpers/database/models/userSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Get options
  const language = await interaction.options.getString("language");

  // Get user object
  const userDB = await users.findOne({
    userId: interaction?.user?.id,
    guildId: interaction?.guild?.id,
  });

  // Modify values
  userDB.language = language !== null ? language : userDB.language;

  // Save guild
  await userDB.save().then(async () => {
    // Create embed object
    const embed = {
      title: ":hammer: Settings - User [Appearance]",
      description: "Following settings is set!",
      color: config.colors.success as any,
      fields: [
        {
          name: "🏳️‍🌈 Language",
          value: `${userDB.language}`,
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
      `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} has changed appearance settings.`
    );
  });
};

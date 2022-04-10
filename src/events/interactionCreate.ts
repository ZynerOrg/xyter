import config from "../../config.json";
import logger from "../handlers/logger";
import guilds from "../helpers/database/models/guildSchema";

import { Interaction, ColorResolvable } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    // Destructure member, client
    const { client, guild } = interaction;

    // If interaction is command
    if (interaction.isCommand()) {
      // Get command from collection
      const command = client.commands.get(interaction.commandName);

      // If command do not exist
      if (!command) return;

      // Create guild if it does not exist already
      await guilds.findOne({ guildId: guild?.id }, { new: true, upsert: true });

      try {
        // Defer reply
        await interaction.deferReply();

        // Execute command
        await command.execute(interaction);

        // Send debug message
        logger.debug(`Executing command: ${interaction.commandName}`);
      } catch (e) {
        // Send debug message
        logger.error(e);

        // Send interaction reply
        await interaction.reply({
          embeds: [
            {
              author: {
                name: client?.user?.username,
                icon_url: client?.user?.displayAvatarURL(),
                url: "https://bot.zyner.org/",
              },
              title: "Error",
              description: "There was an error while executing this command!",
              color: config.colors.error as ColorResolvable,
              timestamp: new Date(),
            },
          ],
          ephemeral: true,
        });
      }
    }
  },
};

// Dependencies
import { CommandInteraction, EmbedBuilder } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import Chance from "chance";

// Configurations
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

// Handlers
import logger from "../../../../../middlewares/logger";

// Models
import * as cooldown from "../../../../../helpers/cooldown";

// Helpers
import fetchUser from "../../../../../helpers/fetchUser";
import fetchGuild from "../../../../../helpers/fetchGuild";

export default {
  metadata: { guildOnly: true, ephemeral: true },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command.setName("work").setDescription(`Work to earn credits`);
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    ); // Destructure member
    const { guild, user } = interaction;

    const embed = new EmbedBuilder()
      .setTitle("[:dollar:] Work")
      .setTimestamp(new Date())
      .setFooter({
        text: footerText,
        iconURL: footerIcon,
      });

    // Chance module
    const chance = new Chance();

    if (guild === null) {
      return logger?.silly(`Guild is null`);
    }

    const guildDB = await fetchGuild(guild);

    await cooldown.command(interaction, guildDB?.credits?.workTimeout);

    const creditsEarned = chance.integer({
      min: 0,
      max: guildDB?.credits?.workRate,
    });

    const userDB = await fetchUser(user, guild);

    if (userDB === null) {
      return logger?.silly(`User not found`);
    }

    userDB.credits += creditsEarned;

    await userDB?.save()?.then(async () => {
      logger?.silly(
        `User ${userDB?.userId} worked and earned ${creditsEarned} credits`
      );

      return interaction.editReply({
        embeds: [
          embed
            .setDescription(`You worked and earned ${creditsEarned} credits.`)
            .setColor(successColor),
        ],
      });
    });
  },
};

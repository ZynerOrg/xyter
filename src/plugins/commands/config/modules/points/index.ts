import { CommandInteraction, Permissions } from "discord.js";

import getEmbedConfig from "../../../../../helpers/getEmbedConfig";

import logger from "../../../../../middlewares/logger";

import guildSchema from "../../../../../models/guild";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [Permissions.FLAGS.MANAGE_GUILD],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("points")
      .setDescription("Points")
      .addBooleanOption((option) =>
        option.setName("status").setDescription("Should credits be enabled?")
      )
      .addNumberOption((option) =>
        option.setName("rate").setDescription("Amount of credits per message.")
      )
      .addNumberOption((option) =>
        option
          .setName("minimum-length")
          .setDescription("Minimum length of message to earn credits.")
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (milliseconds).")
      );
  },
  execute: async (interaction: CommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );

    const { options, guild } = interaction;

    const status = options?.getBoolean("status");
    const rate = options?.getNumber("rate");
    const timeout = options?.getNumber("timeout");
    const minimumLength = options?.getNumber("minimum-length");

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild not found in database.`);
    }

    guildDB.points.status = status !== null ? status : guildDB?.points?.status;
    guildDB.points.rate = rate !== null ? rate : guildDB?.points?.rate;
    guildDB.points.timeout =
      timeout !== null ? timeout : guildDB?.points?.timeout;
    guildDB.points.minimumLength =
      minimumLength !== null ? minimumLength : guildDB?.points?.minimumLength;

    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild points updated.`);

      return interaction?.editReply({
        embeds: [
          {
            title: ":hammer: Settings - Guild [Points]",
            description: `Points settings updated.`,
            color: successColor,
            fields: [
              {
                name: "🤖 Status",
                value: `${guildDB?.points?.status}`,
                inline: true,
              },
              {
                name: "📈 Rate",
                value: `${guildDB?.points?.rate}`,
                inline: true,
              },
              {
                name: "🔨 Minimum Length",
                value: `${guildDB?.points?.minimumLength}`,
                inline: true,
              },
              {
                name: "⏰ Timeout",
                value: `${guildDB?.points?.timeout}`,
                inline: true,
              },
            ],
            timestamp: new Date(),
            footer: {
              iconURL: footerIcon,
              text: footerText,
            },
          },
        ],
      });
    });
  },
};

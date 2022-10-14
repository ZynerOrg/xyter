import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
} from "discord.js";
import getEmbedConfig from "../../../../../helpers/getEmbedData";
import logger from "../../../../../middlewares/logger";
import guildSchema from "../../../../../models/guild";

export default {
  metadata: {
    guildOnly: true,
    ephemeral: true,
    permissions: [PermissionsBitField.Flags.ManageGuild],
  },

  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("credits")
      .setDescription(`Credits`)
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
          .setName("work-rate")
          .setDescription("Maximum amount of credits on work.")
      )
      .addNumberOption((option) =>
        option
          .setName("work-timeout")
          .setDescription("Timeout between work schedules (seconds).")
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (seconds).")
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { successColor, footerText, footerIcon } = await getEmbedConfig(
      interaction.guild
    );
    const { guild, options } = interaction;

    if (!guild) return;

    const status = options?.getBoolean("status");
    const rate = options?.getNumber("rate");
    const timeout = options?.getNumber("timeout");
    const minimumLength = options?.getNumber("minimum-length");
    const workRate = options?.getNumber("work-rate");
    const workTimeout = options?.getNumber("work-timeout");

    const guildDB = await guildSchema?.findOne({
      guildId: guild?.id,
    });

    if (guildDB === null) {
      return logger?.silly(`Guild is null`);
    }

    guildDB.credits.status =
      status !== null ? status : guildDB?.credits?.status;
    guildDB.credits.rate = rate !== null ? rate : guildDB?.credits?.rate;
    guildDB.credits.timeout =
      timeout !== null ? timeout : guildDB?.credits?.timeout;
    guildDB.credits.workRate =
      workRate !== null ? workRate : guildDB?.credits?.workRate;
    guildDB.credits.workTimeout =
      workTimeout !== null ? workTimeout : guildDB?.credits?.workTimeout;
    guildDB.credits.minimumLength =
      minimumLength !== null ? minimumLength : guildDB?.credits?.minimumLength;

    await guildDB?.save()?.then(async () => {
      logger?.silly(`Guild saved`);

      const interactionEmbed = new EmbedBuilder()
        .setTitle("[:tools:] Credits")
        .setDescription("Credits settings updated")
        .setColor(successColor)
        .addFields(
          {
            name: "🤖 Status",
            value: `${guildDB?.credits?.status}`,
            inline: true,
          },
          {
            name: "📈 Rate",
            value: `${guildDB?.credits?.rate}`,
            inline: true,
          },
          {
            name: "📈 Work Rate",
            value: `${guildDB?.credits?.workRate}`,
            inline: true,
          },
          {
            name: "🔨 Minimum Length",
            value: `${guildDB?.credits?.minimumLength}`,
            inline: true,
          },
          {
            name: "⏰ Timeout",
            value: `${guildDB?.credits?.timeout}`,
            inline: true,
          },
          {
            name: "⏰ Work Timeout",
            value: `${guildDB?.credits?.workTimeout}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          iconURL: footerIcon,
          text: footerText,
        });

      return interaction?.editReply({
        embeds: [interactionEmbed],
      });
    });
  },
};

// Dependencies
import { CommandInteraction } from "discord.js";

// Configurations
import { successColor, footerText, footerIcon } from "@config/embed";

//Handlers
import logger from "@logger";

// Models
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

import prisma from "@root/database/prisma";
import { Prisma } from "@prisma/client";

// Function
export default {
  data: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("credits")
      .setDescription(`Credits`)
      .addBooleanOption((option) =>
        option
          .setName("status")
          .setDescription("Should credits be enabled?")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("rate")
          .setDescription("Amount of credits per message.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("minimum-length")
          .setDescription("Minimum length of message to earn credits.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("work-rate")
          .setDescription("Maximum amount of credits on work.")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("work-timeout")
          .setDescription("Timeout between work schedules (seconds).")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("timeout")
          .setDescription("Timeout between earning credits (seconds).")
          .setRequired(true)
      );
  },
  execute: async (interaction: CommandInteraction) => {
    // Destructure member
    const { guild, options } = interaction;

    // Get options
    const status = options.getBoolean("status");
    const rate = options.getNumber("rate");
    const timeout = options.getNumber("timeout");
    const minimumLength = options.getNumber("minimum-length");
    const workRate = options.getNumber("work-rate");
    const workTimeout = options.getNumber("work-timeout");

    if (status === null) return;
    if (rate === null) return;
    if (timeout === null) return;
    if (minimumLength === null) return;
    if (workRate === null) return;
    if (workTimeout === null) return;

    if (!guild) return;

    const moduleCredits = await prisma.module.upsert({
      where: {
        guildId_name: {
          guildId: guild.id,
          name: "credits",
        },
      },
      update: {
        enabled: status,
        data: {
          rate: rate,
          timeout: timeout,
          minimumLength: minimumLength,
          workRate: workRate,
          workTimeout: workTimeout,
        },
      },
      create: {
        guildId: guild.id,
        name: "credits",
        enabled: status,
        data: {
          rate: rate,
          timeout: timeout,
          minimumLength: minimumLength,
          workRate: workRate,
          workTimeout: workTimeout,
        },
      },
    });

    logger.silly(moduleCredits);

    const moduleData = moduleCredits.data as Prisma.JsonObject;

    return interaction?.editReply({
      embeds: [
        {
          title: ":tools: Settings - Guild [Credits]",
          description: `Credits settings updated.`,
          color: successColor,
          fields: [
            {
              name: "🤖 Status",
              value: `${moduleCredits?.enabled}`,
              inline: true,
            },
            {
              name: "📈 Rate",
              value: `${moduleData?.rate}`,
              inline: true,
            },
            {
              name: "📈 Work Rate",
              value: `${moduleData?.workRate}`,
              inline: true,
            },
            {
              name: "🔨 Minimum Length",
              value: `${moduleData?.minimumLength}`,
              inline: true,
            },
            {
              name: "⏰ Timeout",
              value: `${moduleData?.timeout}`,
              inline: true,
            },
            {
              name: "⏰ Work Timeout",
              value: `${moduleData?.workTimeout}`,
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
  },
};

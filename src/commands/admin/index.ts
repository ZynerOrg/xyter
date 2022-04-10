import { SlashCommandBuilder } from "@discordjs/builders";
import credits from "./credits";
import counter from "./counter";

import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Admin actions.")
    .addSubcommandGroup((group) =>
      group
        .setName("credits")
        .setDescription("Manage credits.")
        .addSubcommand((command) =>
          command
            .setName("give")
            .setDescription("Give credits to a user")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user you want to pay.")
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("The amount you will pay.")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("set")
            .setDescription("Set credits to a user")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user you want to set credits on.")
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("The amount you will set.")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("take")
            .setDescription("Take credits from a user")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("The user you want to take credits from.")
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("The amount you will take.")
                .setRequired(true)
            )
        )
        .addSubcommand((command) =>
          command
            .setName("transfer")
            .setDescription("Transfer credits from a user to another user.")
            .addUserOption((option) =>
              option
                .setName("from")
                .setDescription("The user you want to take credits from.")
                .setRequired(true)
            )
            .addUserOption((option) =>
              option
                .setName("to")
                .setDescription("The user you want to give credits to.")
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName("amount")
                .setDescription("The amount you will transfer.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("counter")
        .setDescription("Manage counters.")
        .addSubcommand((command) =>
          command
            .setName("add")
            .setDescription("Add a counter")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The counter channel.")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("word")
                .setDescription("The counter word.")
                .setRequired(true)
            )
            .addNumberOption((option) =>
              option.setName("start").setDescription("Start at number X.")
            )
        )
        .addSubcommand((command) =>
          command
            .setName("remove")
            .setDescription("Remove a counter")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The counter channel.")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: CommandInteraction) {
    // If subcommand group is credits
    if (interaction.options.getSubcommandGroup() === "credits") {
      // Execute credits group
      await credits(interaction);
    }

    // If subcommand group is credits
    else if (interaction.options.getSubcommandGroup() === "counter") {
      // Execute credits group
      await counter(interaction);
    }
  },
};

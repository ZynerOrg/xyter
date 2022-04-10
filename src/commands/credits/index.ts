import { SlashCommandBuilder } from "@discordjs/builders";
import balance from "./addons/balance";
import gift from "./addons/gift";
import top from "./addons/top";
import work from "./addons/work";
import { CommandInteraction } from "discord.js";
export default {
  data: new SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("balance")
        .setDescription("Check a user's balance.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user whose balance you want to check.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("gift")
        .setDescription("Gift someone credits from your credits.")
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
        .addStringOption((option) =>
          option.setName("reason").setDescription("Your reason.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("top").setDescription("Check the top balance.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("work").setDescription("Work for credits.")
    ),
  async execute(interaction: CommandInteraction) {
    // If subcommand is balance
    if (interaction.options.getSubcommand() === "balance") {
      // Execute balance addon
      await balance(interaction);
    }

    // If subcommand is gift
    else if (interaction.options.getSubcommand() === "gift") {
      // Execute gift addon
      await gift(interaction);
    }

    // If subcommand is top
    else if (interaction.options.getSubcommand() === "top") {
      // Execute top addon
      await top(interaction);
    }

    // If subcommand is work
    else if (interaction.options.getSubcommand() === "work") {
      // Execute work addon
      await work(interaction);
    }
  },
};

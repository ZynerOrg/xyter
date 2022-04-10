import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions, CommandInteraction } from "discord.js";
import guilds from "../../helpers/database/models/guildSchema";
import pterodactyl from "./addons/pterodactyl";
import roles from "./roles";

export default {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Open our shop.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pterodactyl")
        .setDescription("Buy pterodactyl power.")
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("How much credits you want to withdraw.")
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("roles")
        .setDescription("Manage custom roles.")
        .addSubcommand((command) =>
          command
            .setName("buy")
            .setDescription("Buy a custom role")
            .addStringOption((option) =>
              option
                .setName("name")
                .setDescription("Name of the role you wish to purchase.")
            )
        )
        .addSubcommand((command) =>
          command
            .setName("cancel")
            .setDescription("Cancel a custom role")
            .addRoleOption((option) =>
              option
                .setName("role")
                .setDescription("Name of the role you wish to cancel.")
            )
        )
    ),
  async execute(interaction: CommandInteraction) {
    // If subcommand is pterodactyl
    if (interaction.options.getSubcommand() === "pterodactyl") {
      // Execute pterodactyl addon
      await pterodactyl(interaction);
    }

    // If subcommand group is roles
    else if (interaction.options.getSubcommandGroup() === "roles") {
      // Execute roles addon
      await roles(interaction);
    }
  },
};

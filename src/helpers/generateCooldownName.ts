import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

export default async (interaction: CommandInteraction) => {
  const { commandName } = interaction;

  if (interaction instanceof ChatInputCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    return subcommandGroup
      ? `${commandName}-${subcommandGroup}-${subcommand}`
      : `${commandName}-${subcommand}`;
  }

  return commandName;
};

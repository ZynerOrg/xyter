// Dependencies
import { ChatInputCommandInteraction } from "discord.js";

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { client, commandName } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) throw new Error(`Unknown command ${commandName}`);

  await currentCommand.execute(interaction);
};

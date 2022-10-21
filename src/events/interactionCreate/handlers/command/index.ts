// Dependencies
import { ChatInputCommandInteraction } from "discord.js";

export default async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.isCommand()) return;
  const { client, commandName } = interaction;

  const currentCommand = client.commands.get(commandName);
  if (!currentCommand) throw new Error(`Unknown command ${commandName}`);

  // const metadata = await getCommandMetadata(interaction, currentCommand);
  // await deferReply(interaction, metadata.ephemeral || false);

  // if (metadata.guildOnly && !interaction.guild)
  // throw new Error("This command is guild only.");

  // if (metadata.dmOnly && interaction.guild)
  // throw new Error("This command is only available in DM");

  // if (
  //   metadata.permissions &&
  //   metadata.guildOnly &&
  //   !interaction.memberPermissions?.has(metadata.permissions)
  // )
  //   throw new Error("You don't have the required permissions");

  // if (metadata.cooldown) {
  //   await CooldownCommand(interaction, metadata.cooldown);
  // }
  await currentCommand.execute(interaction);
};

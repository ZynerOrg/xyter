import { CommandInteraction } from "discord.js";
import { default as CooldownManager } from "../../../../handlers/CooldownManager";
import interactionErrorHandler from "../../../../handlers/interactionErrorHandler";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import handleCooldown from "./handlers/handleCooldown";
import handleUnavailableCommand from "./handlers/handleUnavailableCommand";

// Create a map to store locks for each identifier (guild ID + user ID + cooldown item)
const commandLocks = new Map();

const cooldownManager = new CooldownManager();

export default async function handleCommandInteraction(
  interaction: CommandInteraction
) {
  if (!interaction.isCommand()) {
    return;
  }

  const { client, commandName, user, guild } = interaction;
  const currentCommand = client.commands.get(commandName);

  if (!currentCommand) {
    await handleUnavailableCommand(interaction, commandName);
    return;
  }

  try {
    const cooldownItem = await generateCooldownName(interaction);

    // Check if the identifier is already locked
    if (commandLocks.has(cooldownItem)) {
      throw new Error(
        "You are unable to execute the same command simultaneously."
      );
    }

    const { guildCooldown, userCooldown, guildMemberCooldown } =
      await cooldownManager.checkCooldowns(cooldownItem, guild, user);

    if (
      (guildCooldown && guildCooldown.expiresAt > new Date()) ||
      (userCooldown && userCooldown.expiresAt > new Date()) ||
      (guildMemberCooldown && guildMemberCooldown.expiresAt > new Date())
    ) {
      await handleCooldown(
        interaction,
        guildCooldown,
        userCooldown,
        guildMemberCooldown
      );
      return;
    }

    // Create a promise that represents the current command execution
    const commandExecutionPromise = currentCommand.execute(interaction);

    // Acquire the lock for the identifier and store the command execution promise
    commandLocks.set(cooldownItem, commandExecutionPromise);

    // Wait for the current command execution to complete
    await commandExecutionPromise;
  } catch (error) {
    await interactionErrorHandler(interaction, error);
  } finally {
    const cooldownItem = await generateCooldownName(interaction);

    // Release the lock for the identifier
    commandLocks.delete(cooldownItem);
  }
}

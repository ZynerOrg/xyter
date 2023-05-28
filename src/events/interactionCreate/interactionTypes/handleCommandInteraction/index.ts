import { CommandInteraction } from "discord.js";
import { default as CooldownManager } from "../../../../handlers/CooldownManager";
import interactionErrorHandler from "../../../../handlers/interactionErrorHandler";
import generateCooldownName from "../../../../helpers/generateCooldownName";
import handleCooldown from "./handlers/handleCooldown";
import handleUnavailableCommand from "./handlers/handleUnavailableCommand";

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
    const { guildCooldown, userCooldown, guildMemberCooldown } =
      await cooldownManager.checkCooldowns(cooldownItem, guild, user);

    if (guildCooldown || userCooldown || guildMemberCooldown) {
      await handleCooldown(
        interaction,
        guildCooldown,
        userCooldown,
        guildMemberCooldown
      );
    } else {
      await currentCommand.execute(interaction);
    }
  } catch (error) {
    await interactionErrorHandler(interaction, error);
  }
}

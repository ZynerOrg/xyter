import { ChatInputCommandInteraction } from "discord.js";

export interface SubcommandHandlers {
  [subcommand: string]: (
    interaction: ChatInputCommandInteraction
  ) => Promise<void>;
}

export interface SubcommandGroupHandlers {
  [subcommandGroup: string]: SubcommandHandlers;
}

export const executeSubcommand = async (
  interaction: ChatInputCommandInteraction,
  subcommandHandlers: SubcommandHandlers,
  subcommandGroupHandlers?: SubcommandGroupHandlers
) => {
  const subcommandGroup = interaction.options.getSubcommandGroup();
  if (subcommandGroupHandlers && subcommandGroup) {
    const handlers = subcommandGroupHandlers?.[subcommandGroup];
    if (handlers) {
      await executeSubcommand(interaction, handlers);
      return;
    } else {
      throw new Error(`Subcommand group not found: ${subcommandGroup}`);
    }
  }

  const subcommand = interaction.options.getSubcommand();
  const handler = subcommandHandlers[subcommand];

  if (handler) {
    await handler(interaction);
  } else {
    throw new Error(`Subcommand not found: ${subcommand}`);
  }
};

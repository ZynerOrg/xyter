// Dependencies
import { BaseInteraction } from "discord.js";

export default async (interaction: BaseInteraction) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (!currentButton) throw new Error(`Unknown button ${customId}`);

  await currentButton.execute(interaction);
};

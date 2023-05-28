import { ButtonInteraction } from "discord.js";
import interactionErrorHandler from "../../../../handlers/interactionErrorHandler";

export default async function handleButtonInteraction(
  interaction: ButtonInteraction
) {
  const { customId } = interaction;

  const currentButton = await import(`../../../buttons/${customId}`);

  if (!currentButton) {
    throw new Error(`Unknown button ${customId}`);
  }

  try {
    await currentButton.execute(interaction);
  } catch (error) {
    await interactionErrorHandler(interaction, error);
  }
}

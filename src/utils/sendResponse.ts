import {
  ButtonInteraction,
  CommandInteraction,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
} from "discord.js";
import logger from "./logger";

export default async (
  interaction: CommandInteraction | ButtonInteraction,
  response: InteractionReplyOptions | InteractionEditReplyOptions | string
) => {
  try {
    if (interaction instanceof ButtonInteraction) {
      await (interaction as ButtonInteraction).reply(
        response as InteractionReplyOptions
      );
    } else {
      if (interaction.deferred) {
        await (interaction as CommandInteraction).editReply(
          response as InteractionEditReplyOptions
        );
      } else {
        await (interaction as CommandInteraction).reply(
          response as InteractionReplyOptions
        );
      }
    }
  } catch (error) {
    logger.error("Error occurred while sending the response:", error);
  }
};

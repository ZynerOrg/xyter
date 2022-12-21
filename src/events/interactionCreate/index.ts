import { BaseInteraction, InteractionType } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import audits from "./audits";
import button from "./handlers/button";
import chatInputCommand from "./handlers/chatInputCommand";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: BaseInteraction) => {
  logger.silly({ interaction });
  const { guild, user } = interaction;

  if (guild) {
    await upsertGuildMember(guild, user);
  }

  switch (interaction.type) {
    case InteractionType.ApplicationCommand: {
      if (interaction.isChatInputCommand()) {
        await chatInputCommand(interaction);
        return;
      }

      if (interaction.isButton()) {
        await button(interaction);
        return;
      }

      break;
    }
    default:
      throw new Error("Unknown interaction type");
  }

  await audits.execute(interaction);
};

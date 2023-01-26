import { BaseInteraction, InteractionType } from "discord.js";
import upsertGuildMember from "../../helpers/upsertGuildMember";
import { IEventOptions } from "../../interfaces/EventOptions";
import logger from "../../middlewares/logger";
import sendAuditEntry from "./components/sendAuditEntry";
import button from "./handlers/button";
import chatInputCommand from "./handlers/chatInputCommand";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: BaseInteraction) => {
  const { guild, user } = interaction;

  logger.verbose({
    message: `New interaction created: ${interaction.id} by: ${user.tag} (${user.id})`,
    interaction,
    guild,
    user,
  });

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

  await sendAuditEntry(interaction);
};

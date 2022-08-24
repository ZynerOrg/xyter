// 3rd party dependencies
import { CommandInteraction, MessageEmbed } from "discord.js";

// Dependencies
import * as handlers from "./handlers";

import logger from "../../../middlewares/logger";
import audits from "./audits";
import { IEventOptions } from "../../../interfaces/EventOptions";
import capitalizeFirstLetter from "../../../helpers/capitalizeFirstLetter";
import getEmbedConfig from "../../../helpers/getEmbedConfig";

export const options: IEventOptions = {
  type: "on",
};

export const execute = async (interaction: CommandInteraction) => {
  const { guild, id } = interaction;

  logger?.silly(
    `New interaction: ${id} in guild: ${guild?.name} (${guild?.id})`
  );

  const { errorColor, footerText, footerIcon } = await getEmbedConfig(
    interaction.guild
  );

  await audits.execute(interaction);

  await handlers.execute(interaction).catch(async (err) => {
    logger.debug(`${err}`);

    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setTitle(
            `[:x:] ${capitalizeFirstLetter(
              interaction.options.getSubcommand()
            )}`
          )
          .setDescription(`${"``"}${err}${"``"}`)
          .setColor(errorColor)
          .setTimestamp(new Date())
          .setFooter({ text: footerText, iconURL: footerIcon }),
      ],
    });
  });
};

import i18next from "i18next";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import users from "../../../helpers/database/models/userSchema";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  try {
    // Destructure member
    const { member } = await interaction;

    // Get options
    const target = await interaction.options.getUser("target");

    // Get discord user object
    const discordUser = await interaction.client.users.fetch(
      `${target ? target.id : interaction?.user?.id}`
    );

    // Get user object
    const userDB = await users.findOne({
      userId: await discordUser?.id,
      guildId: interaction?.guild?.id,
    });

    // Create embed object
    const embed = {
      author: {
        name: `${await discordUser.username}#${await discordUser.discriminator}`,
        icon_url: await discordUser.displayAvatarURL(),
      },
      color: config.colors.success as any,
      fields: [
        {
          name: `:dollar: Credits`,
          value: `${userDB.credits || "Not found"}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Level`,
          value: `${userDB.level || "Not found"}`,
          inline: true,
        },
        {
          name: `:squeeze_bottle: Points`,
          value: `${userDB.points || "Not found"}`,
          inline: true,
        },
        {
          name: `:loudspeaker: Reputation`,
          value: `${userDB.reputation || "Not found"}`,
          inline: true,
        },
        {
          name: `:rainbow_flag: Language`,
          value: `${userDB.language || "Not found"}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    return await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    // Send debug message
    await logger.error(e);
  }
};

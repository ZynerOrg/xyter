import i18next from "i18next";
import { CommandInteraction } from "discord.js";
import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import users from "../../../helpers/database/models/userSchema";
import timeouts from "../../../helpers/database/models/timeoutSchema";

export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Get options
  const target = await interaction.options.getUser("target");
  const type = await interaction.options.getString("type");

  // Get user object
  const userDB = await users.findOne({
    userId: interaction?.user?.id,
    guildId: interaction?.guild?.id,
  });

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: interaction?.guild?.id,
    userId: interaction?.user?.id,
    timeoutId: 2,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Do not allow self reputation
    if (target?.id === interaction?.user?.id) {
      // Create embed object
      const embed = {
        title: ":loudspeaker: Reputation - Give",
        description: "You can not repute yourself.",
        timestamp: new Date(),
        color: config.colors.error as any,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed] });
    }

    // If type is positive
    if (type === "positive") {
      userDB.reputation += 1;
    }

    // If type is negative
    if (type === "negative") {
      userDB.reputation -= 1;
    }

    // Save user
    await userDB.save().then(async () => {
      // Create embed object
      const embed = {
        title: ":loudspeaker: Reputation - Give",
        description: `You have given ${target} a ${type} reputation!`,
        timestamp: new Date(),
        color: config.colors.success as any,
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      await interaction.editReply({ embeds: [embed] });

      // Send debug message
      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} has given ${target?.id} a ${type} reputation.`
      );

      // Create a timeout for the user
      await timeouts.create({
        guildId: interaction?.guild?.id,
        userId: interaction?.user?.id,
        timeoutId: 2,
      });
    });

    setTimeout(async () => {
      // send debug message
      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${
          interaction?.user?.id
        } has not repute within last ${
          config.reputation.timeout / 1000
        } seconds, reputation can be given`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: interaction?.guild?.id,
        userId: interaction?.user?.id,
        timeoutId: 2,
      });
    }, config.reputation.timeout);
  } else {
    // Create embed object
    const embed = {
      title: ":loudspeaker: Reputation - Give",
      description: `You have given reputation within the last ${
        config.reputation.timeout / 1000
      } seconds, you can not repute now!`,
      timestamp: new Date(),
      color: config.colors.error as any,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${interaction?.guild?.id} User: ${
        interaction?.user?.id
      } has repute within last ${
        config.reputation.timeout / 1000
      } seconds, no reputation can be given`
    );
  }
};

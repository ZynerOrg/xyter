import config from "../../../../config.json";
import logger from "../../../handlers/logger";
import guilds from "../../../helpers/database/models/guildSchema";
import users from "../../../helpers/database/models/userSchema";
import timeouts from "../../../helpers/database/models/timeoutSchema";
import creditNoun from "../../../helpers/creditNoun";
import { CommandInteraction } from "discord.js";
export default async (interaction: CommandInteraction) => {
  // Destructure member
  const { member } = interaction;

  // Check if user has a timeout
  const isTimeout = await timeouts.findOne({
    guildId: interaction?.guild?.id,
    userId: interaction?.user?.id,
    timeoutId: "2022-03-15-19-16",
  });

  const guildDB = await guilds.findOne({
    guildId: interaction?.guild?.id,
  });

  // If user is not on timeout
  if (!isTimeout) {
    // Make a variable of how much credits user will earn based on random multiplied with work rate
    const creditsEarned = Math.floor(Math.random() * guildDB.credits.workRate);

    const userDB = await users.findOne({
      userId: interaction?.user?.id,
      guildId: interaction?.guild?.id,
    });

    userDB.credits += creditsEarned;

    await userDB.save().then(async () => {
      // Send debug message
      await logger.debug(`Credits added to user: ${interaction?.user?.id}`);

      // Create embed object
      const embed = {
        title: ":dollar: Credits - Work",
        description: `You have earned ${creditNoun(creditsEarned)}`,
        color: config.colors.success as any,
        timestamp: new Date(),
        footer: { iconURL: config.footer.icon, text: config.footer.text },
      };

      // Send interaction reply
      return interaction.editReply({ embeds: [embed] });
    });

    // Create a timeout for the user
    await timeouts.create({
      guildId: interaction?.guild?.id,
      userId: interaction?.user?.id,
      timeoutId: "2022-03-15-19-16",
    });

    setTimeout(async () => {
      // Send debug message
      await logger.debug(
        `Guild: ${interaction?.guild?.id} User: ${
          interaction?.user?.id
        } has not worked within the last ${
          guildDB.work.timeout / 1000
        } seconds, work can be done`
      );

      // When timeout is out, remove it from the database
      await timeouts.deleteOne({
        guildId: interaction?.guild?.id,
        userId: interaction?.user?.id,
        timeoutId: "2022-03-15-19-16",
      });
    }, guildDB.credits.workTimeout);
  } else {
    // Create embed object
    const embed = {
      title: ":dollar: Credits - Work",
      description: `You have worked within the last ${
        guildDB.credits.workTimeout / 1000
      } seconds, you can not work now!`,
      timestamp: new Date(),
      color: config.colors.error as any,
      footer: { iconURL: config.footer.icon, text: config.footer.text },
    };

    // Send interaction reply
    await interaction.editReply({ embeds: [embed] });

    // Send debug message
    await logger.debug(
      `Guild: ${interaction?.guild?.id} User: ${interaction?.user?.id} has worked within last day, no work can be done`
    );
  }
};

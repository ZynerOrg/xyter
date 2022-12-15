import { BaseInteraction, EmbedBuilder } from "discord.js";
import auditLogger from "../../helpers/auditLogger";

export default {
  execute: async (interaction: BaseInteraction) => {
    const { guild, user } = interaction;
    if (!guild) throw new Error("Guild unavailable");
    if (!user) throw new Error("User unavailable");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Interaction Created",
        iconURL: user.displayAvatarURL(),
      })
      .addFields([
        {
          name: "ID",
          value: `${interaction.id}`,
          inline: true,
        },
        {
          name: "Type",
          value: `${interaction.type}`,
          inline: true,
        },
        {
          name: "User ID",
          value: `${interaction.user} (${interaction.user.tag})`,
          inline: true,
        },
        {
          name: "Channel",
          value: `${interaction.channel}`,
          inline: true,
        },
      ]);

    await auditLogger(guild, embed);
  },
};

// Dependencies
// Helpers
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
// Configurations
// import fetchUser from "../../../../../../helpers/userData";
// Models
import deferReply from "../../../../../../handlers/deferReply";

// Function
export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("cancel")
      .setDescription("Cancel a purchase.")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Role you wish to cancel.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    // const { successColor, footerText, footerIcon } = await getEmbedConfig(
    //   interaction.guild
    // );
    // const { options, guild, user, member } = interaction;
    // const optionRole = options.getRole("role");
    // if (optionRole === null)
    //   throw new Error("We could not read your requested role.");
    // const roleExist = await shopRolesSchema?.findOne({
    //   guildId: guild?.id,
    //   userId: user?.id,
    //   roleId: optionRole?.id,
    // });
    // if (roleExist === null) return;
    // await (member?.roles as GuildMemberRoleManager)?.remove(optionRole?.id);
    // await guild?.roles
    //   .delete(optionRole?.id, `${user?.id} canceled from shop`)
    //   .then(async () => {
    //     const userDB = await fetchUser(user, guild);
    //     if (userDB === null) {
    //       return logger?.silly(`User is null`);
    //     }
    //     await shopRolesSchema?.deleteOne({
    //       roleId: optionRole?.id,
    //       userId: user?.id,
    //       guildId: guild?.id,
    //     });
    //     const interactionEmbed = new EmbedBuilder()
    //       .setTitle("[:shopping_cart:] Cancel")
    //       .setDescription(`You have canceled ${optionRole.name}.`)
    //       .setTimestamp()
    //       .setColor(successColor)
    //       .addFields({
    //         name: "Your balance",
    //         value: `${pluralize(userDB?.credits, "credit")}`,
    //       })
    //       .setFooter({ text: footerText, iconURL: footerIcon });
    //     return interaction?.editReply({
    //       embeds: [interactionEmbed],
    //     });
    //   });
  },
};

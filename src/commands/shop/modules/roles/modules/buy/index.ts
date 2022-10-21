// Dependencies
// Helpers
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import deferReply from "../../../../../../handlers/deferReply";
// Configurations
// import fetchUser from "../../../../../../helpers/userData";
// Models

// Function
export default {
  builder: (command: SlashCommandSubcommandBuilder) => {
    return command
      .setName("buy")
      .setDescription("Buy a custom role.")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Name of the role you wish to buy.")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("color")
          .setDescription("Color of the role you wish to buy.")
          .setRequired(true)
      );
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    await deferReply(interaction, true);

    // const { successColor, footerText, footerIcon } = await getEmbedConfig(
    //   interaction.guild
    // );
    // const { options, guild, user, member } = interaction;
    // const optionName = options?.getString("name");
    // const optionColor = options?.getString("color");
    // // If amount is null
    // if (optionName === null)
    //   throw new Error("We could not read your requested name");
    // await guild?.roles
    //   .create({
    //     name: optionName,
    //     color: optionColor as ColorResolvable,
    //     reason: `${user?.id} bought from shop`,
    //   })
    //   .then(async (role) => {
    //     // Get guild object
    //     const guildDB = await guildSchema?.findOne({
    //       guildId: guild?.id,
    //     });
    //     const userDB = await fetchUser(user, guild);
    //     if (userDB === null) {
    //       return logger?.silly(`User is null`);
    //     }
    //     if (guildDB === null) {
    //       return logger?.silly(`Guild is null`);
    //     }
    //     if (guildDB.shop === null) {
    //       return logger?.silly(`Shop is null`);
    //     }
    //     const { pricePerHour } = guildDB.shop.roles;
    //     userDB.credits -= pricePerHour;
    //     await userDB?.save();
    //     await shopRolesSchema?.create({
    //       roleId: role?.id,
    //       userId: user?.id,
    //       guildId: guild?.id,
    //       pricePerHour,
    //       lastPayed: new Date(),
    //     });
    //     await (member?.roles as GuildMemberRoleManager)?.add(role?.id);
    //     logger?.silly(`Role ${role?.name} was bought by ${user?.tag}`);
    //     const interactionEmbed = new EmbedBuilder()
    //       .setTitle("[:shopping_cart:] Buy")
    //       .setDescription(
    //         `You bought **${optionName}** for **${pluralize(
    //           pricePerHour,
    //           "credit"
    //         )}**.`
    //       )
    //       .setTimestamp()
    //       .setColor(successColor)
    //       .setFooter({ text: footerText, iconURL: footerIcon });
    //     return interaction?.editReply({
    //       embeds: [interactionEmbed],
    //     });
    //   })
    //   .catch(() => {
    //     throw new Error("Failed creating role.");
    //   });
  },
};

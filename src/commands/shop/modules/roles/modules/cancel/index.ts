// Dependencies
// Helpers
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMemberRoleManager,
  SlashCommandSubcommandBuilder,
} from "discord.js";
// Configurations
// Models
import deferReply from "../../../../../../handlers/deferReply";
import logger from "../../../../../../middlewares/logger";
// Configurations
// Models

import prisma from "../../../../../../handlers/database";
import getEmbedData from "../../../../../../helpers/getEmbedData";
import pluralize from "../../../../../../helpers/pluralize";

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

    const { successColor, footerText, footerIcon } = await getEmbedData(
      interaction.guild
    );
    const { options, guild, user, member } = interaction;
    const optionRole = options.getRole("role");
    if (optionRole === null)
      throw new Error("We could not read your requested role.");
    if (!guild) throw new Error("No guild specified");
    if (!user) throw new Error("No user specified");

    const roleExist = await prisma.guildShopRoles.findUnique({
      where: {
        guildId_userId_roleId: {
          guildId: guild.id,
          userId: user.id,
          roleId: optionRole.id,
        },
      },
    });
    if (roleExist === null) return;
    await (member?.roles as GuildMemberRoleManager)?.remove(optionRole?.id);
    await guild?.roles
      .delete(optionRole?.id, `${user?.id} canceled from shop`)
      .then(async () => {
        const createGuildMember = await prisma.guildMember.upsert({
          where: {
            userId_guildId: {
              userId: user.id,
              guildId: guild.id,
            },
          },
          update: {},
          create: {
            user: {
              connectOrCreate: {
                create: {
                  id: user.id,
                },
                where: {
                  id: user.id,
                },
              },
            },
            guild: {
              connectOrCreate: {
                create: {
                  id: guild.id,
                },
                where: {
                  id: guild.id,
                },
              },
            },
          },
          include: {
            user: true,
            guild: true,
          },
        });

        logger.silly(createGuildMember);

        if (!createGuildMember) throw new Error("Guild member not created");

        const deleteShopRole = await prisma.guildShopRoles.delete({
          where: {
            guildId_userId_roleId: {
              guildId: guild?.id,
              userId: user?.id,
              roleId: optionRole?.id,
            },
          },
        });

        logger.silly(deleteShopRole);

        const interactionEmbed = new EmbedBuilder()
          .setTitle("[:shopping_cart:] Cancel")
          .setDescription(`You have canceled ${optionRole.name}.`)
          .setTimestamp()
          .setColor(successColor)
          .addFields({
            name: "Your balance",
            value: `${pluralize(createGuildMember.creditsEarned, "credit")}`,
          })
          .setFooter({ text: footerText, iconURL: footerIcon });
        return interaction?.editReply({
          embeds: [interactionEmbed],
        });
      });
  },
};

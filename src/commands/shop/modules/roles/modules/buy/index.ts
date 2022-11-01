// Dependencies
// Helpers
import {
  ChatInputCommandInteraction,
  ColorResolvable,
  EmbedBuilder,
  GuildMemberRoleManager,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import deferReply from "../../../../../../handlers/deferReply";
import getEmbedData from "../../../../../../helpers/getEmbedData";
import logger from "../../../../../../middlewares/logger";
// Configurations
// import fetchUser from "../../../../../../helpers/userData";
// Models

import prisma from "../../../../../../handlers/database";
import pluralize from "../../../../../../helpers/pluralize";

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

    const { successColor, footerText, footerIcon } = await getEmbedData(
      interaction.guild
    );
    const { options, guild, user, member } = interaction;
    const optionName = options?.getString("name");
    const optionColor = options?.getString("color");
    // If amount is null
    if (optionName === null)
      throw new Error("We could not read your requested name");
    await guild?.roles
      .create({
        name: optionName,
        color: optionColor as ColorResolvable,
        reason: `${user?.id} bought from shop`,
      })
      .then(async (role) => {
        const userId = "SNOWFLKAE";
        const guildId = "SNOWFLAKE";

        const createGuildMember = await prisma.guildMember.upsert({
          where: {
            userId_guildId: {
              userId,
              guildId,
            },
          },
          update: {},
          create: {
            user: {
              connectOrCreate: {
                create: {
                  id: userId,
                },
                where: {
                  id: userId,
                },
              },
            },
            guild: {
              connectOrCreate: {
                create: {
                  id: guildId,
                },
                where: {
                  id: guildId,
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

        // Get guild object
        const pricePerHour = createGuildMember.guild.shopRolesPricePerHour;

        const updateGuildMember = await prisma.guildMember.update({
          where: {
            userId_guildId: {
              userId,
              guildId,
            },
          },
          data: {
            creditsEarned: { decrement: pricePerHour },
          },
        });

        logger.silly(updateGuildMember);

        const createShopRole = await prisma.guildShopRoles.upsert({
          where: {
            guildId_userId_roleId: {
              guildId: guild.id,
              userId: user.id,
              roleId: role.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            lastPayed: new Date(),
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

        logger.silly(createShopRole);

        await (member?.roles as GuildMemberRoleManager)?.add(role?.id);
        logger?.silly(`Role ${role?.name} was bought by ${user?.tag}`);
        const interactionEmbed = new EmbedBuilder()
          .setTitle("[:shopping_cart:] Buy")
          .setDescription(
            `You bought **${optionName}** for **${pluralize(
              pricePerHour,
              "credit"
            )}**.`
          )
          .setTimestamp()
          .setColor(successColor)
          .setFooter({ text: footerText, iconURL: footerIcon });
        return interaction?.editReply({
          embeds: [interactionEmbed],
        });
      })
      .catch(() => {
        throw new Error("Failed creating role.");
      });
  },
};

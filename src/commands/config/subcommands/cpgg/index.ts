import {
  ChatInputCommandInteraction,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import prisma from "../../../../handlers/database";
import deferReply from "../../../../handlers/deferReply";
import { success as embedSuccess } from "../../../../helpers/baseEmbeds";
import checkPermission from "../../../../helpers/checkPermission";
import encryption from "../../../../helpers/encryption";
import logger from "../../../../middlewares/logger";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("cpgg")
    .setDescription("Controlpanel.gg API")
    .addStringOption((option) =>
      option
        .setName("scheme")
        .setDescription(`API protocol`)
        .setRequired(true)
        .setChoices(
          { name: "HTTPS (secure)", value: "https" },
          { name: "HTTP (insecure)", value: "http" }
        )
    )
    .addStringOption((option) =>
      option.setName("domain").setDescription(`API domain`).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("token").setDescription(`API Token`).setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { options, guild } = interaction;
  if (!guild) throw new Error("Guild unavailable");

  const scheme = options.getString("scheme");
  const domain = options.getString("domain");
  const tokenData = options.getString("token");
  if (!scheme) throw new Error("Scheme must be set");
  if (!domain) throw new Error("Domain must be set");
  if (!tokenData) throw new Error("Token must be set");

  const url = encryption.encrypt(`${scheme}://${domain}`);
  const token = encryption.encrypt(tokenData);
  if (!url) throw new Error("URL must be set");
  if (!token) throw new Error("Token must be set");

  const upsertGuildConfigApisCpgg = await prisma.guildConfigApisCpgg.upsert({
    where: {
      id: guild.id,
    },
    update: {
      tokenIv: token.iv,
      tokenContent: token.content,
      urlIv: url.iv,
      urlContent: url.content,
    },
    create: {
      id: guild.id,
      tokenIv: token.iv,
      tokenContent: token.content,
      urlIv: url.iv,
      urlContent: url.content,
    },
  });

  logger.silly(upsertGuildConfigApisCpgg);

  const successEmbed = await embedSuccess(
    guild,
    ":gear:︱Configuration of CPGG"
  );

  successEmbed.setDescription("Configuration updated successfully!").addFields(
    {
      name: "Scheme",
      value: `${scheme}`,
      inline: true,
    },
    {
      name: "Domain",
      value: `${domain}`,
      inline: true,
    },
    {
      name: "Token",
      value: `ends with ${tokenData.slice(-4)}`,
      inline: true,
    }
  );

  await interaction.editReply({
    embeds: [successEmbed],
  });
  return;
};

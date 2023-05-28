import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import CtrlPanelAPI, {
  CtrlPanelAPIError,
} from "../../../../services/CtrlPanelAPI";
import checkPermission from "../../../../utils/checkPermission";
import deferReply from "../../../../utils/deferReply";
import logger from "../../../../utils/logger";
import sendResponse from "../../../../utils/sendResponse";

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("ctrlpanel")
    .setDescription("Ctrlpanel.gg API")
    .addStringOption((option) =>
      option
        .setName("scheme")
        .setDescription("API protocol")
        .setRequired(true)
        .addChoices(
          { name: "HTTPS (secure)", value: "https" },
          { name: "HTTP (insecure)", value: "http" }
        )
    )
    .addStringOption((option) =>
      option.setName("domain").setDescription("API domain").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("token").setDescription("API Token").setRequired(true)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);

  const { guild, options, user } = interaction;
  if (!guild) throw new Error("Guild unavailable");

  const scheme = options.getString("scheme", true);
  const domain = options.getString("domain", true);
  const tokenData = options.getString("token", true);
  if (!scheme || !domain || !tokenData)
    throw new Error("Scheme, domain, and token must be set");

  const ctrlPanelAPI = new CtrlPanelAPI(guild);

  try {
    await ctrlPanelAPI.updateApiCredentials(scheme, domain, tokenData);

    const embedSuccess = new EmbedBuilder()
      .setAuthor({
        name: "Configuration of Ctrlpanel.gg",
        iconURL: "https://ctrlpanel.gg/img/controlpanel.png",
      })
      .setColor(process.env.EMBED_COLOR_SUCCESS)
      .setFooter({
        text: `Successfully configured by ${user.username}`,
        iconURL: user.displayAvatarURL(),
      })
      .setTimestamp()
      .setDescription(`API Address: \`${scheme}://${domain}\``);

    await sendResponse(interaction, { embeds: [embedSuccess] });
  } catch (error: unknown) {
    if (error instanceof CtrlPanelAPIError) {
      logger.error("CtrlPanelAPI error:", error.message);
      throw error;
    }
  }
};

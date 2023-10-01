// Dependencies
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionsBitField,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
// Configurations
import CtrlPanelAPI from "../../../../../../services/CtrlPanelAPI";
import checkPermission from "../../../../../../utils/checkPermission";
import deferReply from "../../../../../../utils/deferReply";
import { GuildNotFoundError } from "../../../../../../utils/errors";
import sendResponse from "../../../../../../utils/sendResponse";

// Function
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("giveaway")
    .setDescription("Giveaway some credits for specified amount of users.")
    .addIntegerOption((option) =>
      option
        .setName("uses")
        .setDescription("How many users should be able to use this.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("credit")
        .setDescription(`How much credits provided per use.`)
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to send the message to.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const { guild, options } = interaction;

  await deferReply(interaction, true);
  checkPermission(interaction, PermissionsBitField.Flags.ManageGuild);
  if (!guild) throw new GuildNotFoundError();

  const ctrlPanelAPI = new CtrlPanelAPI(guild);

  const uses = options?.getInteger("uses", true);
  const creditAmount = options?.getInteger("credit", true);
  const channel = options?.getChannel("channel", true);

  const embedSuccess = new EmbedBuilder()
    .setTitle(":toolbox:︱Giveaway")
    .setColor("#FFFFFF")
    .setTimestamp(new Date());

  const code = uuidv4();
  const { redeemUrl } = await ctrlPanelAPI.generateVoucher(
    code,
    creditAmount,
    uses
  );

  await sendResponse(interaction, {
    embeds: [embedSuccess.setDescription(`Successfully created code: ${code}`)],
  });

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("Redeem it here")
      .setStyle(ButtonStyle.Link)
      .setEmoji("🏦")
      .setURL(`${redeemUrl}`)
  );

  const discordChannel = await guild.channels.fetch(channel.id);
  if (!discordChannel) return;
  if (discordChannel.type !== ChannelType.GuildText) return;

  discordChannel.send({
    embeds: [
      embedSuccess
        .addFields([
          {
            name: "💶 Credits",
            value: `${creditAmount}`,
            inline: true,
          },
        ])
        .setDescription(
          `${interaction.user} dropped a voucher for a maximum **${uses}** members!`
        ),
    ],
    components: [buttons],
  });
};

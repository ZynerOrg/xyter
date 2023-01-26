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
import checkPermission from "../../../../../helpers/checkPermission";
import deferReply from "../../../../../helpers/deferReply";
import getEmbedConfig from "../../../../../helpers/getEmbedConfig";
import createVoucher from "../../../../../modules/cpgg/features/createVoucher";

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

  const { successColor, footerText, footerIcon } = await getEmbedConfig(guild);

  const uses = options?.getInteger("uses");
  const creditAmount = options?.getInteger("credit");
  const channel = options?.getChannel("channel");

  if (!uses) throw new Error("Amount of uses is required.");
  if (!creditAmount) throw new Error("Amount of credits is required.");
  if (!channel) throw new Error("Channel is required.");
  if (!guild) throw new Error("Guild is required.");

  const embedSuccess = new EmbedBuilder()
    .setTitle(":toolbox:︱Giveaway")
    .setColor(successColor)
    .setFooter({ text: footerText, iconURL: footerIcon })
    .setTimestamp(new Date());

  const code = uuidv4();
  const { redeemUrl } = await createVoucher(guild, code, creditAmount, uses);

  await interaction.editReply({
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

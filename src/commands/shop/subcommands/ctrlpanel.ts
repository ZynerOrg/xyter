import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { v4 as uuidv4 } from "uuid";
import CreditsManager from "../../../handlers/CreditsManager";
import CtrlPanelAPI from "../../../services/CtrlPanelAPI";
import deferReply from "../../../utils/deferReply";
import sendResponse from "../../../utils/sendResponse";

const creditsManager = new CreditsManager();

export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("ctrlpanel")
    .setDescription("Buy cpgg power.")
    .addIntegerOption((option) =>
      option
        .setName("withdraw")
        .setDescription("How much credits you want to withdraw.")
        .setRequired(true)
        .setMinValue(100)
        .setMaxValue(999999)
    );
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await deferReply(interaction, true);

  const { options, guild, user, client } = interaction;
  if (!guild) throw new Error("This command can only be executed in a guild");

  const ctrlPanelAPI = new CtrlPanelAPI(guild);

  const withdrawalAmount = options.getInteger("withdraw", true);

  await creditsManager.take(guild, user, withdrawalAmount);

  const voucherCode = uuidv4();
  const { redeemUrl } = await ctrlPanelAPI.generateVoucher(
    voucherCode,
    withdrawalAmount,
    1
  );

  const userDM = await client.users.fetch(user.id);
  const dmEmbed = new EmbedBuilder()
    .setTitle(":shopping_cart:︱CPGG")
    .setDescription(`This voucher was generated in guild: **${guild.name}**.`)
    .setTimestamp()
    .addFields({
      name: "💶 Credits",
      value: `${withdrawalAmount}`,
      inline: true,
    })
    .setColor(process.env.EMBED_COLOR_SUCCESS);

  const redemptionButton = new ButtonBuilder()
    .setLabel("Redeem it here")
    .setStyle(ButtonStyle.Link)
    .setEmoji("🏦")
    .setURL(redeemUrl);

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    redemptionButton
  );

  const dmMessage: Message = await userDM.send({
    embeds: [dmEmbed],
    components: [actionRow],
  });

  const interactionEmbed = new EmbedBuilder()
    .setTitle(":shopping_cart:︱CPGG")
    .setDescription(`I have sent you the code in [DM](${dmMessage.url})!`)
    .setTimestamp()
    .setColor(process.env.EMBED_COLOR_SUCCESS);

  await sendResponse(interaction, { embeds: [interactionEmbed] });
};

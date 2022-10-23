import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import deferReply from "../../../../handlers/deferReply";
import { success as BaseEmbedSuccess } from "../../../../helpers/baseEmbeds";
import creditsTransfer from "../../../../helpers/credits/transfer";

// 1. Export a builder function.
export const builder = (command: SlashCommandSubcommandBuilder) => {
  return command
    .setName("gift")
    .setDescription(`Gift a user credits`)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user you want to gift credits to.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("credits")
        .setDescription("The amount of credits you want to gift.")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100000000)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Your reason.")
    );
};

// 2. Export an execute function.
export const execute = async (interaction: ChatInputCommandInteraction) => {
  // 1. Defer reply as ephemeral.
  await deferReply(interaction, true);

  // 2. Destructure interaction object.
  const { options, user, guild, client } = interaction;
  if (!guild) throw new Error("Guild not found");
  if (!user) throw new Error("User not found");
  if (!client) throw new Error("Client not found");
  if (!options) throw new Error("Options not found");

  // 3. Get options from interaction.
  const target = options.getUser("target");
  const credits = options.getInteger("credits");
  const reason = options.getString("reason");
  if (!target) throw new Error("Target user not found");
  if (typeof credits !== "number")
    throw new Error("You need to specify a number of credits you want to gift");

  // 4. Create base embeds.
  const EmbedSuccess = await BaseEmbedSuccess(guild, "[:dollar:] Gift");

  // 5. Start an transaction of the credits.
  await creditsTransfer(guild, user, target, credits);

  // 6. Tell the target that they have been gifted credits.
  await target.send({
    embeds: [
      EmbedSuccess.setDescription(
        reason
          ? `You received ${credits} credits from ${user} for the reason: ${reason}.`
          : `You received ${credits} credits from ${user}.`
      ),
    ],
  });

  // 7. Tell the sender that they have gifted the credits.
  await interaction.editReply({
    embeds: [
      EmbedSuccess.setDescription(
        reason
          ? `You have successfully gifted ${credits} credits to ${target} with reason: ${reason}.`
          : `You have successfully gifted ${credits} credits to ${target}.`
      ),
    ],
  });
};

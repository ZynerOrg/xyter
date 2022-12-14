"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const discord_js_1 = require("discord.js");
// Configurations
// Helpers../../../../../../../helpers/userData
const pluralize_1 = __importDefault(require("../../../../../../helpers/pluralize"));
// Models
// Handlers
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const baseEmbeds_1 = require("../../../../../../helpers/baseEmbeds");
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
const give_1 = __importDefault(require("../../../../../../helpers/credits/give"));
exports.default = {
    builder: (command) => {
        return command
            .setName("give")
            .setDescription("Give credits to a user.")
            .addUserOption((option) => option
            .setName("user")
            .setDescription("The user to give credits to.")
            .setRequired(true))
            .addIntegerOption((option) => option
            .setName("amount")
            .setDescription(`The amount of credits to give.`)
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Defer reply as ephemeral.
        yield (0, deferReply_1.default)(interaction, true);
        // 2. Check if the user has the MANAGE_GUILD permission.
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        // 3. Destructure interaction object.
        const { guild, options } = interaction;
        if (!guild)
            throw new Error("We could not get the current guild from discord.");
        if (!options)
            throw new Error("We could not get the options from discord.");
        // 4. Get the user and amount from the options.
        const discordReceiver = options.getUser("user");
        const creditsAmount = options.getInteger("amount");
        if (typeof creditsAmount !== "number")
            throw new Error("You need to provide a credit amount.");
        if (!discordReceiver)
            throw new Error("We could not get the receiving user from Discord");
        // 5. Create base embeds.
        const embedSuccess = yield (0, baseEmbeds_1.success)(guild, "[:toolbox:] Give");
        // 6. Give the credits.
        yield (0, give_1.default)(guild, discordReceiver, creditsAmount);
        // 7. Send embed.
        return yield interaction.editReply({
            embeds: [
                embedSuccess.setDescription(`Successfully gave ${(0, pluralize_1.default)(creditsAmount, "credit")}`),
            ],
        });
    }),
};

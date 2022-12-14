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
// Helpers
// Models
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const baseEmbeds_1 = require("../../../../../../helpers/baseEmbeds");
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
const set_1 = __importDefault(require("../../../../../../helpers/credits/set"));
exports.default = {
    builder: (command) => {
        return command
            .setName("set")
            .setDescription("Set the amount of credits a user has.")
            .addUserOption((option) => option
            .setName("user")
            .setDescription("The user to set the amount of credits for.")
            .setRequired(true))
            .addIntegerOption((option) => option
            .setName("amount")
            .setDescription(`The amount of credits to set.`)
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Defer reply as ephemeral.
        yield (0, deferReply_1.default)(interaction, true);
        // 2. Check if the user has the permission to manage the guild.
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        // 3. Destructure interaction object.
        const { options, guild } = interaction;
        if (!guild)
            throw new Error(`We could not find this guild.`);
        if (!options)
            throw new Error(`We could not find the options.`);
        // 4. Get the user and amount from the options.
        const discordUser = options.getUser("user");
        const creditAmount = options.getInteger("amount");
        if (typeof creditAmount !== "number")
            throw new Error("Amount is not set.");
        if (!discordUser)
            throw new Error("User is not specified");
        // 5. Set the credits.
        yield (0, set_1.default)(guild, discordUser, creditAmount);
        // 6. Create base embeds.
        const embedSuccess = yield (0, baseEmbeds_1.success)(guild, "[:toolbox:] Set");
        // 7. Send embed.
        return yield interaction.editReply({
            embeds: [
                embedSuccess.setDescription(`Set **${discordUser}**'s credits to **${creditAmount}**.`),
            ],
        });
    }),
};

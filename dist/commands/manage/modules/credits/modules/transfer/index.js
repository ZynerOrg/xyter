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
// Models
const discord_js_1 = require("discord.js");
const transfer_1 = __importDefault(require("../../../../../../helpers/credits/transfer"));
// Configurations
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("transfer")
            .setDescription("Transfer credits from one user to another.")
            .addUserOption((option) => option
            .setName("from")
            .setDescription("The user to transfer credits from.")
            .setRequired(true))
            .addUserOption((option) => option
            .setName("to")
            .setDescription("The user to transfer credits to.")
            .setRequired(true))
            .addIntegerOption((option) => option
            .setName("amount")
            .setDescription(`The amount of credits to transfer.`)
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild); // Destructure member
        const { guild, options } = interaction;
        // Get options
        const optionFromUser = options === null || options === void 0 ? void 0 : options.getUser("from");
        const optionToUser = options === null || options === void 0 ? void 0 : options.getUser("to");
        const optionAmount = options === null || options === void 0 ? void 0 : options.getInteger("amount");
        if (optionAmount === null)
            throw new Error("Amount is not specified");
        if (optionAmount <= 0)
            throw new Error("You need to set amount above zero to transfer.");
        if (!guild)
            throw new Error(`We could not find this guild.`);
        if (!optionFromUser)
            throw new Error("You must provide a user to transfer from.");
        if (!optionToUser)
            throw new Error("You must provide a user to transfer to.");
        yield (0, transfer_1.default)(guild, optionFromUser, optionToUser, optionAmount);
        return interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle("[:toolbox:] Manage - Credits (Transfer)")
                    .setDescription(`Transferred ${optionAmount} credits.`)
                    .setTimestamp(new Date())
                    .setColor(successColor)
                    .setFooter({ text: footerText, iconURL: footerIcon }),
            ],
        });
    }),
};

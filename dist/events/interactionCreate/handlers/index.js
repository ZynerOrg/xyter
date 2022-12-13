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
exports.handleCommandInteraction = exports.execute = void 0;
const discord_js_1 = require("discord.js");
const getEmbedData_1 = __importDefault(require("../../../helpers/getEmbedData"));
const button_1 = __importDefault(require("./button"));
const command_1 = __importDefault(require("./command"));
// Send interactions to all available handlers
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, button_1.default)(interaction);
    yield (0, command_1.default)(interaction);
});
exports.execute = execute;
// Handle interactions from commands
const handleCommandInteraction = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { errorColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
    yield (0, command_1.default)(interaction).catch((err) => {
        const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Report Problem")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setEmoji("📝")
            .setURL("https://discord.zyner.org"));
        return interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle(`:no_entry_sign:︱Your request failed`)
                    .setDescription(`${err.message}`)
                    .setColor(errorColor)
                    .setTimestamp(new Date())
                    .setFooter({ text: footerText, iconURL: footerIcon }),
            ],
            components: [buttons],
        });
    });
});
exports.handleCommandInteraction = handleCommandInteraction;

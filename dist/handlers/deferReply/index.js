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
const discord_js_1 = require("discord.js");
const getEmbedData_1 = __importDefault(require("../../helpers/getEmbedData"));
exports.default = (interaction, ephemeral) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isRepliable())
        throw new Error(`Cannot reply to an interaction that is not repliable`);
    yield interaction.deferReply({
        ephemeral,
    });
    const embedConfig = yield (0, getEmbedData_1.default)(interaction.guild);
    yield interaction.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setFooter({
                text: embedConfig.footerText,
                iconURL: embedConfig.footerIcon,
            })
                .setTimestamp(new Date())
                .setTitle("⏳︱Your request are being processed")
                .setColor(embedConfig.waitColor)
                .setDescription("This might take a while, please wait..."),
        ],
    });
});

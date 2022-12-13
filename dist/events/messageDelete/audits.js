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
const database_1 = __importDefault(require("../../handlers/database"));
const getEmbedData_1 = __importDefault(require("../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.default = {
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message === null)
            return;
        if (message.guild === null)
            return;
        const { footerText, footerIcon, successColor } = yield (0, getEmbedData_1.default)(message.guild);
        const getGuild = yield database_1.default.guild.findUnique({
            where: { id: message.guild.id },
        });
        if (!getGuild)
            throw new Error("Guild not found");
        const { client } = message;
        if (!getGuild)
            throw new Error("Guild not found");
        if (getGuild.auditsEnabled !== true)
            return;
        if (!getGuild.auditsChannelId)
            return;
        const channel = client.channels.cache.get(`${getGuild.auditsChannelId}`);
        if (!channel)
            return;
        if (channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        channel
            .send({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(successColor)
                    .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                })
                    .setDescription(`
            **Message sent by** ${message.author} **deleted in** ${message.channel}
            ${message.content}
            `)
                    .setTimestamp()
                    .setFooter({
                    text: footerText,
                    iconURL: footerIcon,
                }),
            ],
        })
            .then(() => {
            var _a, _b;
            logger_1.default.info(`Audit log sent for event messageDelete in guild ${(_a = message === null || message === void 0 ? void 0 : message.guild) === null || _a === void 0 ? void 0 : _a.name} (${(_b = message === null || message === void 0 ? void 0 : message.guild) === null || _b === void 0 ? void 0 : _b.id})`);
        })
            .catch(() => {
            var _a, _b;
            throw new Error(`Audit log failed to send for event messageDelete in guild ${(_a = message === null || message === void 0 ? void 0 : message.guild) === null || _a === void 0 ? void 0 : _a.name} (${(_b = message === null || message === void 0 ? void 0 : message.guild) === null || _b === void 0 ? void 0 : _b.id})`);
        });
    }),
};

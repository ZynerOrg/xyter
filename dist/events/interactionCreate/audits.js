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
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (interaction === null)
            return;
        if (interaction.guild === null)
            return;
        const getGuild = yield database_1.default.guild.findUnique({
            where: { id: interaction.guild.id },
        });
        if (!getGuild)
            throw new Error("Guild not found");
        const { footerText, footerIcon, successColor } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { client } = interaction;
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
                    .setDescription(`
            **Interaction created by** ${interaction.user.username} **in** ${interaction.channel}
            ㅤ**Interaction ID**: ${interaction.id}
            ㅤ**Type**: ${interaction.type}
            ㅤ**User ID**: ${interaction.user.id}
            `)
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({
                    text: footerText,
                    iconURL: footerIcon,
                }),
            ],
        })
            .then(() => {
            var _a, _b;
            logger_1.default.debug(`Audit log sent for event interactionCreate in guild ${(_a = interaction === null || interaction === void 0 ? void 0 : interaction.guild) === null || _a === void 0 ? void 0 : _a.name} (${(_b = interaction === null || interaction === void 0 ? void 0 : interaction.guild) === null || _b === void 0 ? void 0 : _b.id})`);
        })
            .catch(() => {
            logger_1.default.silly("Failed to send audit log for event interactionCreate");
        });
    }),
};

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
    execute: (member) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { client, guild } = member;
        const getGuild = yield database_1.default.guild.findUnique({
            where: { id: member.guild.id },
        });
        if (!getGuild)
            throw new Error("Guild not found");
        if (getGuild.auditsEnabled !== true)
            return;
        if (!getGuild.auditsChannelId) {
            throw new Error("Channel not found");
        }
        const embedConfig = yield (0, getEmbedData_1.default)(guild);
        const channel = client.channels.cache.get(getGuild.auditsChannelId);
        if (!channel)
            throw new Error("Channel not found");
        if (channel.type !== discord_js_1.ChannelType.GuildText) {
            throw new Error("Channel must be a text channel");
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTimestamp(new Date())
            .setAuthor({
            name: "Member Joined",
            iconURL: (_a = client.user) === null || _a === void 0 ? void 0 : _a.displayAvatarURL(),
        })
            .setFooter({
            text: embedConfig.footerText,
            iconURL: embedConfig.footerIcon,
        });
        yield channel
            .send({
            embeds: [
                embed
                    .setColor(embedConfig.successColor)
                    .setDescription(`${member.user} - (${member.user.tag})`)
                    .addFields([
                    {
                        name: "Account Age",
                        value: `${member.user.createdAt}`,
                    },
                ]),
            ],
        })
            .then(() => {
            logger_1.default.debug(`Audit log sent for event guildMemberAdd`);
        })
            .catch(() => {
            throw new Error("Audit log failed to send");
        });
    }),
};

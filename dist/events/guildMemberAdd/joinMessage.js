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
exports.default = {
    execute: (member) => __awaiter(void 0, void 0, void 0, function* () {
        const { footerText, footerIcon, successColor } = yield (0, getEmbedData_1.default)(member.guild);
        const getGuild = yield database_1.default.guild.findUnique({
            where: { id: member.guild.id },
        });
        if (!getGuild)
            throw new Error("Guild not found");
        const { client } = member;
        if (getGuild.welcomeEnabled !== true)
            return;
        if (!getGuild.welcomeJoinChannelId)
            return;
        const channel = client.channels.cache.get(`${getGuild.welcomeJoinChannelId}`);
        if (!channel)
            throw new Error("Channel not found");
        if (channel.type !== discord_js_1.ChannelType.GuildText)
            throw new Error("Channel is not a text channel");
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor(successColor)
                    .setTitle(`${member.user.username} has joined the server!`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(getGuild.welcomeJoinChannelMessage ||
                    "Configure a join message in the `/settings guild welcome`.")
                    .setTimestamp()
                    .setFooter({
                    text: footerText,
                    iconURL: footerIcon,
                }),
            ],
        });
    }),
};

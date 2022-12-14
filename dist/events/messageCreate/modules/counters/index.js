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
const database_1 = __importDefault(require("../../../../handlers/database"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, author, content, channel } = message;
        if (!guild)
            return;
        if (author.bot)
            return;
        if ((channel === null || channel === void 0 ? void 0 : channel.type) !== discord_js_1.ChannelType.GuildText)
            return;
        const messages = yield message.channel.messages.fetch({ limit: 2 });
        const lastMessage = messages.last();
        const channelCounter = yield database_1.default.guildCounter.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild.id,
                    channelId: channel.id,
                },
            },
        });
        if (!channelCounter) {
            logger_1.default.debug("No counters found in channel.");
            return;
        }
        if ((lastMessage === null || lastMessage === void 0 ? void 0 : lastMessage.author.id) === author.id &&
            channel.id === channelCounter.channelId) {
            logger_1.default.silly(`${author.username} sent the last message therefor not allowing again.`);
            yield message.delete();
            return false;
        }
        if (content !== channelCounter.triggerWord) {
            logger_1.default.silly(`Counter word ${channelCounter.triggerWord} does not match message ${content}`);
            yield message.delete();
            return false;
        }
        const updateGuildCounter = yield database_1.default.guildCounter.update({
            where: {
                guildId_channelId: {
                    guildId: guild.id,
                    channelId: channel.id,
                },
            },
            data: {
                count: {
                    increment: 1,
                },
            },
        });
        logger_1.default.silly(updateGuildCounter);
        if (!updateGuildCounter)
            logger_1.default.error(`Failed to update counter - ${updateGuildCounter}`);
    }),
};

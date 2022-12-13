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
const give_1 = __importDefault(require("../../../../helpers/credits/give"));
const cooldown_1 = __importDefault(require("../../../../middlewares/cooldown"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    execute: (message) => __awaiter(void 0, void 0, void 0, function* () {
        const { guild, author, content, channel } = message;
        if (!guild)
            return;
        if (author.bot)
            return;
        if (channel.type !== discord_js_1.ChannelType.GuildText)
            return;
        const createGuildMember = yield database_1.default.guildMember.upsert({
            where: {
                userId_guildId: {
                    userId: author.id,
                    guildId: guild.id,
                },
            },
            update: {},
            create: {
                user: {
                    connectOrCreate: {
                        create: {
                            id: author.id,
                        },
                        where: {
                            id: author.id,
                        },
                    },
                },
                guild: {
                    connectOrCreate: {
                        create: {
                            id: guild.id,
                        },
                        where: {
                            id: guild.id,
                        },
                    },
                },
            },
            include: {
                user: true,
                guild: true,
            },
        });
        logger_1.default.silly(createGuildMember);
        if (content.length < createGuildMember.guild.creditsMinimumLength)
            return;
        yield (0, cooldown_1.default)(guild, author, "event-messageCreate-credits", createGuildMember.guild.creditsTimeout, true);
        yield (0, give_1.default)(guild, author, createGuildMember.guild.creditsRate);
    }),
};

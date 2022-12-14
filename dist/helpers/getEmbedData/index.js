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
const database_1 = __importDefault(require("../../handlers/database"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.default = (guild) => __awaiter(void 0, void 0, void 0, function* () {
    const { EMBED_COLOR_SUCCESS, EMBED_COLOR_WAIT, EMBED_COLOR_ERROR, EMBED_FOOTER_TEXT, EMBED_FOOTER_ICON, } = process.env;
    const defaultEmbedConfig = {
        successColor: EMBED_COLOR_SUCCESS,
        waitColor: EMBED_COLOR_WAIT,
        errorColor: EMBED_COLOR_ERROR,
        footerText: EMBED_FOOTER_TEXT,
        footerIcon: EMBED_FOOTER_ICON,
    };
    if (!guild) {
        return defaultEmbedConfig;
    }
    const createGuildMember = yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId: guild === null || guild === void 0 ? void 0 : guild.ownerId,
                guildId: guild.id,
            },
        },
        update: {},
        create: {
            user: {
                connectOrCreate: {
                    create: {
                        id: guild.ownerId,
                    },
                    where: {
                        id: guild.ownerId,
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
    if (!createGuildMember) {
        return defaultEmbedConfig;
    }
    return {
        successColor: createGuildMember.guild.embedColorSuccess,
        waitColor: createGuildMember.guild.embedColorWait,
        errorColor: createGuildMember.guild.embedColorError,
        footerText: createGuildMember.guild.embedFooterText,
        footerIcon: createGuildMember.guild.embedFooterIcon,
    };
});

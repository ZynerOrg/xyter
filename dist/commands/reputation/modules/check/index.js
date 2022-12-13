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
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    builder: (command) => {
        return command
            .setName("check")
            .setDescription("Check reputation")
            .addUserOption((option) => option
            .setName("account")
            .setDescription("The account you checking")
            .setRequired(false));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        const { options, guild, user } = interaction;
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
        const optionAccount = options === null || options === void 0 ? void 0 : options.getUser("account");
        if (!guild)
            throw new Error("Server unavailable");
        if (!user)
            throw new Error("User unavailable");
        const createGuildMember = yield database_1.default.guildMember.upsert({
            where: {
                userId_guildId: {
                    userId: (optionAccount || user).id,
                    guildId: guild.id,
                },
            },
            update: {},
            create: {
                user: {
                    connectOrCreate: {
                        create: {
                            id: (optionAccount || user).id,
                        },
                        where: {
                            id: (optionAccount || user).id,
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
        const reputationType = (reputation) => {
            if (reputation < 0)
                return `negative reputation of ${reputation}`;
            if (reputation > 0)
                return `positive reputation of ${reputation}`;
            return "neutral reputation";
        };
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(optionAccount
            ? `:loudspeaker:︱Showing ${optionAccount.username}'s reputation`
            : ":loudspeaker:︱Showing your reputation")
            .setDescription(optionAccount
            ? `${optionAccount} have a ${reputationType(createGuildMember.user.reputationsEarned)}`
            : `You have a ${reputationType(createGuildMember.user.reputationsEarned)}`)
            .setTimestamp()
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon });
        yield interaction.editReply({
            embeds: [interactionEmbed],
        });
    }),
};

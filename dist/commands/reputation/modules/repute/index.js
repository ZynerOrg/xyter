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
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
const noSelfReputation_1 = __importDefault(require("./components/noSelfReputation"));
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const cooldown_1 = __importDefault(require("../../../../middlewares/cooldown"));
exports.default = {
    builder: (command) => {
        return command
            .setName("repute")
            .setDescription("Repute an account")
            .addUserOption((option) => option
            .setName("account")
            .setDescription("The account you repute")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("type")
            .setDescription("Type of reputation")
            .setRequired(true)
            .addChoices({ name: "Positive", value: "positive" }, {
            name: "Negative",
            value: "negative",
        }));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        const { options, user, guild, commandId } = interaction;
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
        const optionAccount = options === null || options === void 0 ? void 0 : options.getUser("account");
        const optionType = options === null || options === void 0 ? void 0 : options.getString("type");
        if (!guild)
            throw new Error("Server unavailable");
        if (!optionAccount)
            throw new Error("User unavailable");
        // Pre-checks
        (0, noSelfReputation_1.default)(optionAccount, user);
        // Check if user is on cooldown otherwise create one
        yield (0, cooldown_1.default)(guild, user, commandId, parseInt(process.env.REPUTATION_TIMEOUT));
        switch (optionType) {
            case "positive": {
                const createUser = yield database_1.default.user.upsert({
                    where: {
                        id: optionAccount.id,
                    },
                    update: {
                        reputationsEarned: {
                            increment: 1,
                        },
                    },
                    create: {
                        id: optionAccount.id,
                        reputationsEarned: 1,
                    },
                });
                logger_1.default.silly(createUser);
                break;
            }
            case "negative": {
                const createUser = yield database_1.default.user.upsert({
                    where: {
                        id: optionAccount.id,
                    },
                    update: {
                        reputationsEarned: {
                            decrement: 1,
                        },
                    },
                    create: {
                        id: optionAccount.id,
                        reputationsEarned: -1,
                    },
                });
                logger_1.default.silly(createUser);
                break;
            }
            default: {
                throw new Error("Invalid reputation type");
            }
        }
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(`:loudspeaker:︱Reputing ${optionAccount.username}`)
            .setDescription(`You have given a ${optionType} repute to ${optionAccount}!`)
            .setTimestamp()
            .setColor(successColor)
            .setFooter({ text: footerText, iconURL: footerIcon });
        yield interaction.editReply({
            embeds: [interactionEmbed],
        });
    }),
};

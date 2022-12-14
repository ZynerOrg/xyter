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
const checkPermission_1 = __importDefault(require("../../../../helpers/checkPermission"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    builder: (command) => {
        return command
            .setName("points")
            .setDescription("Points")
            .addBooleanOption((option) => option
            .setName("status")
            .setDescription("Should credits be enabled?")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("rate")
            .setDescription("Amount of credits per message.")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("minimum-length")
            .setDescription("Minimum length of message to earn credits.")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("timeout")
            .setDescription("Timeout between earning credits (milliseconds).")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild } = interaction;
        const status = options === null || options === void 0 ? void 0 : options.getBoolean("status");
        const rate = options === null || options === void 0 ? void 0 : options.getNumber("rate");
        const timeout = options === null || options === void 0 ? void 0 : options.getNumber("timeout");
        const minimumLength = options === null || options === void 0 ? void 0 : options.getNumber("minimum-length");
        if (!guild)
            throw new Error("Guild is required");
        if (status === null)
            throw new Error("Status must be specified");
        if (!rate)
            throw new Error("Rate must be specified");
        if (!timeout)
            throw new Error("Timeout must be specified");
        if (!minimumLength)
            throw new Error("Minimum length must be specified");
        const createGuild = yield database_1.default.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                pointsEnabled: status,
                pointsRate: rate,
                pointsTimeout: timeout,
                pointsMinimumLength: minimumLength,
            },
            create: {
                id: guild.id,
                pointsEnabled: status,
                pointsRate: rate,
                pointsTimeout: timeout,
                pointsMinimumLength: minimumLength,
            },
        });
        logger_1.default.silly(createGuild);
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] Points")
            .setDescription("Points settings updated")
            .setColor(successColor)
            .addFields({
            name: "🤖 Status",
            value: `${createGuild.pointsEnabled}`,
            inline: true,
        }, {
            name: "📈 Rate",
            value: `${createGuild.pointsRate}`,
            inline: true,
        }, {
            name: "🔨 Minimum Length",
            value: `${createGuild.pointsMinimumLength}`,
            inline: true,
        }, {
            name: "⏰ Timeout",
            value: `${createGuild.pointsTimeout}`,
            inline: true,
        })
            .setTimestamp()
            .setFooter({
            iconURL: footerIcon,
            text: footerText,
        });
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
            embeds: [interactionEmbed],
        }));
        return;
    }),
};

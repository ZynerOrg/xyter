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
            .setName("credits")
            .setDescription(`Configure this guild's credits module.`)
            .addBooleanOption((option) => option
            .setName("enabled")
            .setDescription("Do you want to activate the credit module?")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("rate")
            .setDescription("Credit rate per message.")
            .setRequired(true)
            .setMinValue(1))
            .addNumberOption((option) => option
            .setName("minimum-length")
            .setDescription("Minimum message length to receive credit.")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("work-rate")
            .setDescription("The maximum amount of credit that can be obtained within a working day.")
            .setRequired(true)
            .setMinValue(1))
            .addNumberOption((option) => option
            .setName("work-timeout")
            .setDescription("How long you need to wait before you can work again provided in seconds.")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("timeout")
            .setDescription("How long you need to wait before you can earn more credits.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { guild, options } = interaction;
        const enabled = options.getBoolean("enabled");
        const rate = options.getNumber("rate");
        const timeout = options.getNumber("timeout");
        const minimumLength = options.getNumber("minimum-length");
        const workRate = options.getNumber("work-rate");
        const workTimeout = options.getNumber("work-timeout");
        if (!guild)
            throw new Error("Guild not found.");
        if (typeof enabled !== "boolean")
            throw new Error("Enabled option is not a boolean.");
        if (typeof rate !== "number")
            throw new Error("Rate is not a number.");
        if (typeof workRate !== "number")
            throw new Error("Work rate is not a number.");
        if (typeof workTimeout !== "number")
            throw new Error("Work timeout is not a number.");
        if (typeof timeout !== "number")
            throw new Error("Timeout is not a number.");
        if (typeof minimumLength !== "number")
            throw new Error("Minimum length is not a number.");
        const createGuild = yield database_1.default.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                creditsEnabled: enabled,
                creditsRate: rate,
                creditsTimeout: timeout,
                creditsWorkRate: workRate,
                creditsWorkTimeout: workTimeout,
                creditsMinimumLength: minimumLength,
            },
            create: {
                id: guild.id,
                creditsEnabled: enabled,
                creditsRate: rate,
                creditsTimeout: timeout,
                creditsWorkRate: workRate,
                creditsWorkTimeout: workTimeout,
                creditsMinimumLength: minimumLength,
            },
        });
        logger_1.default.silly(createGuild);
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] Credits")
            .setDescription("Credits settings updated")
            .setColor(successColor)
            .addFields({
            name: "🤖 Enabled?",
            value: `${createGuild.creditsEnabled}`,
            inline: true,
        }, {
            name: "📈 Rate",
            value: `${createGuild.creditsRate}`,
            inline: true,
        }, {
            name: "📈 Work Rate",
            value: `${createGuild.creditsWorkRate}`,
            inline: true,
        }, {
            name: "🔨 Minimum Length",
            value: `${createGuild.creditsMinimumLength}`,
            inline: true,
        }, {
            name: "⏰ Timeout",
            value: `${createGuild.creditsTimeout}`,
            inline: true,
        }, {
            name: "⏰ Work Timeout",
            value: `${createGuild.creditsWorkTimeout}`,
            inline: true,
        })
            .setTimestamp()
            .setFooter({
            iconURL: footerIcon,
            text: footerText,
        });
        yield interaction.editReply({
            embeds: [interactionEmbed],
        });
        return;
    }),
};

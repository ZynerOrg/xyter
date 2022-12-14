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
            .setName("audits")
            .setDescription("Audits")
            .addBooleanOption((option) => option
            .setName("status")
            .setDescription("Should audits be enabled?")
            .setRequired(true))
            .addChannelOption((option) => option
            .setName("channel")
            .setDescription("Channel for audit messages.")
            .addChannelTypes(discord_js_1.ChannelType.GuildText)
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { guild, options } = interaction;
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
        const status = options.getBoolean("status");
        const channel = options.getChannel("channel");
        if (!guild)
            throw new Error("Guild not found.");
        if (!channel)
            throw new Error("Channel not found.");
        if (status === null)
            throw new Error("Status not found.");
        const createGuild = yield database_1.default.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                auditsEnabled: status,
                auditsChannelId: channel.id,
            },
            create: {
                id: guild.id,
                auditsEnabled: status,
                auditsChannelId: channel.id,
            },
        });
        logger_1.default.silly(createGuild);
        const embedSuccess = new discord_js_1.EmbedBuilder()
            .setTitle("[:hammer:] Audits")
            .setDescription("Guild configuration updated successfully.")
            .setColor(successColor)
            .addFields({
            name: "🤖 Status",
            value: `${createGuild.auditsEnabled
                ? ":white_check_mark: Enabled"
                : ":x: Disabled"}`,
            inline: true,
        }, {
            name: "🌊 Channel",
            value: `<#${createGuild.auditsChannelId}>`,
            inline: true,
        })
            .setTimestamp()
            .setFooter({
            iconURL: footerIcon,
            text: footerText,
        });
        yield interaction.editReply({
            embeds: [embedSuccess],
        });
        return;
    }),
};

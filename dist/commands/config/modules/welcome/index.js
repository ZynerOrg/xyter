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
            .setName("welcome")
            .setDescription("Welcome")
            .addBooleanOption((option) => option
            .setName("status")
            .setDescription("Should welcome be enabled?")
            .setRequired(true))
            .addChannelOption((option) => option
            .setName("join-channel")
            .setDescription("Channel for join messages.")
            .addChannelTypes(discord_js_1.ChannelType.GuildText)
            .setRequired(true))
            .addChannelOption((option) => option
            .setName("leave-channel")
            .setDescription("Channel for leave messages.")
            .addChannelTypes(discord_js_1.ChannelType.GuildText)
            .setRequired(true))
            .addStringOption((option) => option
            .setName("leave-message")
            .setDescription("Message for leave messages.")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("join-message")
            .setDescription("Message for join messages.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild } = interaction;
        const status = options === null || options === void 0 ? void 0 : options.getBoolean("status");
        const joinChannel = options === null || options === void 0 ? void 0 : options.getChannel("join-channel");
        const leaveChannel = options === null || options === void 0 ? void 0 : options.getChannel("leave-channel");
        const joinChannelMessage = options === null || options === void 0 ? void 0 : options.getString("join-message");
        const leaveChannelMessage = options === null || options === void 0 ? void 0 : options.getString("leave-message");
        if (!guild)
            throw new Error("Guild not found");
        if (status === null)
            throw new Error("Status not specified");
        if (!joinChannel)
            throw new Error("Join channel not specified");
        if (!joinChannelMessage)
            throw new Error("Join channel message not specified");
        if (!leaveChannel)
            throw new Error("Leave channel not specified");
        if (!leaveChannelMessage)
            throw new Error("Leave channel message not specified");
        const createGuild = yield database_1.default.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                welcomeEnabled: status,
                welcomeJoinChannelId: joinChannel.id,
                welcomeJoinChannelMessage: joinChannelMessage,
                welcomeLeaveChannelId: leaveChannel.id,
                welcomeLeaveChannelMessage: leaveChannelMessage,
            },
            create: {
                id: guild.id,
                welcomeEnabled: status,
                welcomeJoinChannelId: joinChannel.id,
                welcomeJoinChannelMessage: joinChannelMessage,
                welcomeLeaveChannelId: leaveChannel.id,
                welcomeLeaveChannelMessage: leaveChannelMessage,
            },
        });
        logger_1.default.silly(createGuild);
        const interactionEmbedDisabled = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] Welcome")
            .setDescription("This module is currently disabled, please enable it to continue.")
            .setColor(successColor)
            .setTimestamp()
            .setFooter({
            iconURL: footerIcon,
            text: footerText,
        });
        if (!createGuild.welcomeEnabled) {
            return interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                embeds: [interactionEmbedDisabled],
            });
        }
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] Welcome")
            .setDescription(`The following configuration will be used.

        [👋] **Welcome**

        ㅤ**Channel**: <#${createGuild.welcomeJoinChannelId}>
        ㅤ**Message**: ${createGuild.welcomeJoinChannelMessage}

        [🚪] **Leave**

        ㅤ**Channel**: <#${createGuild.welcomeLeaveChannelId}>
        ㅤ**Message**: ${createGuild.welcomeLeaveChannelMessage}`)
            .setColor(successColor)
            .setTimestamp()
            .setFooter({
            iconURL: footerIcon,
            text: footerText,
        });
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
            embeds: [interactionEmbed],
        }));
        return true;
    }),
};

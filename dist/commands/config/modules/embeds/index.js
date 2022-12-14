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
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../helpers/checkPermission"));
const getValues_1 = __importDefault(require("./components/getValues"));
exports.default = {
    builder: (command) => {
        return command
            .setName("embeds")
            .setDescription(`Embeds`)
            .addStringOption((option) => option
            .setName("success-color")
            .setDescription("No provided description")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("wait-color")
            .setDescription("No provided description")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("error-color")
            .setDescription("No provided description")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("footer-icon")
            .setDescription("No provided description")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("footer-text")
            .setDescription("No provided description")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { guild } = interaction;
        if (!guild)
            throw new Error("Guild not found");
        const { successColor, waitColor, errorColor, footerText, footerIcon } = yield (0, getValues_1.default)(interaction);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] Embeds")
            .setFooter({ text: footerText, iconURL: footerIcon })
            .setTimestamp(new Date());
        embed
            .setDescription("Following embed configuration will be used.")
            .setColor(successColor)
            .addFields([
            {
                name: "🟢 Success Color",
                value: `${successColor}`,
                inline: true,
            },
            {
                name: "🟡 Wait Color",
                value: `${waitColor}`,
                inline: true,
            },
            {
                name: "🔴 Error Color",
                value: `${errorColor}`,
                inline: true,
            },
            {
                name: "🖼️ Footer Icon",
                value: `${footerIcon}`,
                inline: true,
            },
            {
                name: "📄 Footer Text",
                value: `${footerText}`,
                inline: true,
            },
        ]);
        yield interaction.editReply({
            embeds: [embed],
        });
        return;
    }),
};

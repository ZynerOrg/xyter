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
const encryption_1 = __importDefault(require("../../../../helpers/encryption"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    builder: (command) => {
        return command
            .setName("cpgg")
            .setDescription("Controlpanel.gg")
            .addStringOption((option) => option
            .setName("scheme")
            .setDescription(`Controlpanel.gg Scheme`)
            .setRequired(true)
            .setChoices({ name: "HTTPS (secure)", value: "https" }, { name: "HTTP (insecure)", value: "http" }))
            .addStringOption((option) => option
            .setName("domain")
            .setDescription(`Controlpanel.gg Domain`)
            .setRequired(true))
            .addStringOption((option) => option
            .setName("token")
            .setDescription(`Controlpanel.gg Application API`)
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild } = interaction;
        const tokenData = options.getString("token");
        const scheme = options.getString("scheme");
        const domain = options.getString("domain");
        const token = tokenData && encryption_1.default.encrypt(tokenData);
        const url = scheme && domain && encryption_1.default.encrypt(`${scheme}://${domain}`);
        if (!guild)
            throw new Error("No guild found");
        if (!token)
            throw new Error("Token not found");
        if (!url)
            throw new Error("URL not found");
        const createGuild = yield database_1.default.guild.upsert({
            where: {
                id: guild.id,
            },
            update: {
                apiCpggTokenIv: token.iv,
                apiCpggTokenContent: token.content,
                apiCpggUrlIv: url.iv,
                apiCpggUrlContent: url.content,
            },
            create: {
                id: guild.id,
                apiCpggTokenIv: token.iv,
                apiCpggTokenContent: token.content,
                apiCpggUrlIv: url.iv,
                apiCpggUrlContent: url.content,
            },
        });
        logger_1.default.silly(createGuild);
        logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Updated API credentials.`);
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setTitle("[:tools:] CPGG")
            .setDescription(`The following configuration will be used.

**Scheme**: ${scheme}
**Domain**: ${domain}
**Token**: ends with ${tokenData === null || tokenData === void 0 ? void 0 : tokenData.slice(-4)}`)
            .setColor(successColor)
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

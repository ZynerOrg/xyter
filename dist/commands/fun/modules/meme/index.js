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
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const cooldown_1 = __importDefault(require("../../../../middlewares/cooldown"));
exports.default = {
    builder: (command) => {
        return command.setName("meme").setDescription("Random memes from r/memes");
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, false);
        const { guild, user, commandId } = interaction;
        if (!guild)
            throw new Error("Server unavailable");
        if (!user)
            throw new Error("User unavailable");
        yield (0, cooldown_1.default)(guild, user, commandId, 15);
        const embedConfig = yield (0, getEmbedData_1.default)(guild);
        yield axios_1.default
            .get("https://www.reddit.com/r/memes/random/.json")
            .then((res) => __awaiter(void 0, void 0, void 0, function* () {
            const response = res.data[0].data.children;
            const content = response[0].data;
            const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setLabel("View post")
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setEmoji("🔗")
                .setURL(`https://reddit.com${content.permalink}`));
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`😆︱Meme`)
                .setDescription(`**${content.title}**`)
                .setTimestamp(new Date())
                .setImage(content.url)
                .setFooter({
                text: `👍 ${content.ups}︱👎 ${content.downs}`,
            })
                .setColor(embedConfig.successColor);
            yield interaction.editReply({ embeds: [embed], components: [buttons] });
            return;
        }))
            .catch((error) => {
            throw new Error(error.message);
        });
    }),
};

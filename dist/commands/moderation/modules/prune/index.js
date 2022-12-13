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
// Dependencies
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../helpers/checkPermission"));
// Configurations
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("prune")
            .setDescription("Prune messages!")
            .addIntegerOption((option) => option
            .setName("count")
            .setDescription("How many messages you want to prune.")
            .setRequired(true))
            .addBooleanOption((option) => option.setName("bots").setDescription("Include bots."));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield (0, deferReply_1.default)(interaction, false);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageMessages);
        const { errorColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const count = interaction.options.getInteger("count");
        if (count === null)
            return;
        const bots = interaction.options.getBoolean("bots");
        if (count < 1 || count > 100) {
            const interactionEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("[:police_car:] Prune")
                .setDescription(`You can only prune between 1 and 100 messages.`)
                .setTimestamp()
                .setColor(errorColor)
                .setFooter({ text: footerText, iconURL: footerIcon });
            yield interaction.editReply({
                embeds: [interactionEmbed],
            });
            return;
        }
        if (((_a = interaction === null || interaction === void 0 ? void 0 : interaction.channel) === null || _a === void 0 ? void 0 : _a.type) !== discord_js_1.ChannelType.GuildText)
            return;
        yield interaction.channel.messages.fetch().then((messages) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const messagesToDelete = (bots
                ? messages.filter((m) => { var _a; return ((_a = m === null || m === void 0 ? void 0 : m.interaction) === null || _a === void 0 ? void 0 : _a.id) !== interaction.id; })
                : messages.filter((m) => { var _a, _b; return ((_a = m === null || m === void 0 ? void 0 : m.interaction) === null || _a === void 0 ? void 0 : _a.id) !== interaction.id && ((_b = m === null || m === void 0 ? void 0 : m.author) === null || _b === void 0 ? void 0 : _b.bot) !== true; })).first(count);
            if (((_b = interaction === null || interaction === void 0 ? void 0 : interaction.channel) === null || _b === void 0 ? void 0 : _b.type) !== discord_js_1.ChannelType.GuildText)
                return;
            yield interaction.channel
                .bulkDelete(messagesToDelete, true)
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                const interactionEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle("[:police_car:] Prune")
                    .setDescription(`Successfully pruned \`${count}\` messages.`)
                    .setTimestamp()
                    .setColor(errorColor)
                    .setFooter({ text: footerText, iconURL: footerIcon });
                yield interaction.editReply({
                    embeds: [interactionEmbed],
                });
            }));
        }));
    }),
};

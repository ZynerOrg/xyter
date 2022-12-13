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
exports.execute = exports.builder = void 0;
const discord_js_1 = require("discord.js");
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const baseEmbeds_1 = require("../../../../helpers/baseEmbeds");
// 1. Create builder function.
const builder = (command) => {
    return command
        .setName("view")
        .setDescription(`View a guild counter`)
        .addChannelOption((option) => option
        .setName("channel")
        .setDescription(`The channel that contains the counter you want to view`)
        .setRequired(true)
        .addChannelTypes(discord_js_1.ChannelType.GuildText));
};
exports.builder = builder;
// 2. Create execute function.
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Defer reply as permanent.
    yield (0, deferReply_1.default)(interaction, false);
    // 2. Destructure interaction object
    const { options, guild } = interaction;
    if (!guild)
        throw new Error(`Guild not found`);
    if (!options)
        throw new Error(`Options not found`);
    // 3. Get options
    const discordChannel = options.getChannel("channel");
    if (!discordChannel)
        throw new Error(`Channel not found`);
    // 4. Create base embeds.
    const EmbedSuccess = yield (0, baseEmbeds_1.success)(guild, "[:1234:] View");
    // 5. Get counter from database.
    const channelCounter = yield database_1.default.guildCounter.findUnique({
        where: {
            guildId_channelId: {
                guildId: guild.id,
                channelId: discordChannel.id,
            },
        },
    });
    if (!channelCounter)
        throw new Error("No counter found for channel");
    // 6. Send embed.
    yield interaction.editReply({
        embeds: [
            EmbedSuccess.setDescription(`Viewing counter for channel ${discordChannel}: ${channelCounter.count}!`),
        ],
    });
});
exports.execute = execute;

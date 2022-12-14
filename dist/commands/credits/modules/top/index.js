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
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
// 1. Export a builder function.
const builder = (command) => {
    return command.setName("top").setDescription(`View the top users`);
};
exports.builder = builder;
// 2. Export an execute function.
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Defer reply as permanent.
    yield (0, deferReply_1.default)(interaction, false);
    // 2. Destructure interaction object.
    const { guild, client } = interaction;
    if (!guild)
        throw new Error("Guild not found");
    if (!client)
        throw new Error("Client not found");
    // 3. Create base embeds.
    const EmbedSuccess = yield (0, baseEmbeds_1.success)(guild, "[:dollar:] Top");
    // 4. Get the top 10 users.
    const topTen = yield database_1.default.guildMember.findMany({
        where: {
            guildId: guild.id,
        },
        orderBy: {
            creditsEarned: "desc",
        },
        take: 10,
    });
    logger_1.default.silly(topTen);
    // 5. Create the top 10 list.
    const entry = (guildMember, index) => `${index + 1}. ${(0, discord_js_1.userMention)(guildMember.userId)} | :coin: ${guildMember.creditsEarned}`;
    // 6. Send embed
    return interaction.editReply({
        embeds: [
            EmbedSuccess.setDescription(`The top 10 users in this server are:\n\n${topTen
                .map(entry)
                .join("\n")}`),
        ],
    });
});
exports.execute = execute;

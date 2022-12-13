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
// Models
const database_1 = __importDefault(require("../../../handlers/database"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
exports.default = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, channel, author, content } = message;
    if (!guild)
        throw new Error("Guild not found");
    if (!channel)
        throw new Error("Channel not found");
    const channelCounter = yield database_1.default.guildCounter.findUnique({
        where: {
            guildId_channelId: {
                guildId: guild.id,
                channelId: channel.id,
            },
        },
    });
    if (!channelCounter)
        return logger_1.default.debug("No counters found in channel.");
    if (content === channelCounter.triggerWord)
        return logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`User: ${author === null || author === void 0 ? void 0 : author.tag} (${author === null || author === void 0 ? void 0 : author.id}) in guild: ${guild === null || guild === void 0 ? void 0 : guild.name} (${guild === null || guild === void 0 ? void 0 : guild.id}) said the counter word: ${channelCounter.triggerWord}`);
    yield message
        .delete()
        .then(() => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`${author} said ${channelCounter.triggerWord} in ${channel}`);
        yield (channel === null || channel === void 0 ? void 0 : channel.send(`${author} said **${channelCounter.triggerWord}**.`));
    }))
        .catch((error) => {
        return logger_1.default.error(error);
    });
    return true;
});

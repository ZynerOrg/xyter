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
exports.execute = exports.options = void 0;
const database_1 = __importDefault(require("../../handlers/database"));
const updatePresence_1 = __importDefault(require("../../handlers/updatePresence"));
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.options = {
    type: "on",
};
// Execute the function
const execute = (guild) => __awaiter(void 0, void 0, void 0, function* () {
    const { client } = guild;
    (0, updatePresence_1.default)(client);
    // Delete guildMember objects
    const deleteGuildMembers = database_1.default.guildMember.deleteMany({
        where: {
            guildId: guild.id,
        },
    });
    // Delete guild object
    const deleteGuild = database_1.default.guild.deleteMany({
        where: {
            id: guild.id,
        },
    });
    // The transaction runs synchronously so deleteUsers must run last.
    yield database_1.default.$transaction([deleteGuildMembers, deleteGuild]);
    logger_1.default.silly(deleteGuildMembers);
    logger_1.default.silly(deleteGuild);
});
exports.execute = execute;

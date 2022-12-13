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
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Modules
const meme_1 = __importDefault(require("./modules/meme"));
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("fun")
    .setDescription("Fun commands.")
    .addSubcommand(meme_1.default.builder);
// Execute function
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { options } = interaction;
    if (options.getSubcommand() === "meme") {
        yield meme_1.default.execute(interaction);
    }
    else {
        logger_1.default.silly(`Unknown subcommand ${options.getSubcommand()}`);
    }
});
exports.execute = execute;

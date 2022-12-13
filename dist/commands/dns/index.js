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
// Modules
const lookup_1 = __importDefault(require("./modules/lookup"));
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("dns")
    .setDescription("DNS commands.")
    // Modules
    .addSubcommand(lookup_1.default.builder);
// Execute the command
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    switch (interaction.options.getSubcommand()) {
        case "lookup":
            yield lookup_1.default.execute(interaction);
            break;
        default:
            throw new Error(`Unknown subcommand: ${interaction.options.getSubcommand()}`);
    }
});
exports.execute = execute;

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
// Dependencies
const discord_js_1 = require("discord.js");
// Modules
const check_1 = __importDefault(require("./modules/check"));
const repute_1 = __importDefault(require("./modules/repute"));
// Function
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("reputation")
    .setDescription("See and repute users to show other how trustworthy they are")
    .setDMPermission(false)
    // Modules
    .addSubcommand(repute_1.default.builder)
    .addSubcommand(check_1.default.builder);
// Execute function
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.options.getSubcommand() === "repute") {
        yield repute_1.default.execute(interaction);
        return;
    }
    if (interaction.options.getSubcommand() === "check") {
        yield check_1.default.execute(interaction);
        return;
    }
});
exports.execute = execute;

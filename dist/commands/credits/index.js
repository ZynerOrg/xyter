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
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.builder = void 0;
const discord_js_1 = require("discord.js");
// Modules
const balance_1 = require("./modules/balance");
const gift_1 = require("./modules/gift");
const top_1 = require("./modules/top");
const work_1 = require("./modules/work");
// 1. Export a builder function.
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("credits")
    .setDescription("Manage your credits.")
    .setDMPermission(false)
    // Modules
    .addSubcommand(balance_1.builder)
    .addSubcommand(gift_1.builder)
    .addSubcommand(top_1.builder)
    .addSubcommand(work_1.builder);
// 2. Export an execute function.
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    switch (interaction.options.getSubcommand()) {
        case "balance":
            yield (0, balance_1.execute)(interaction);
            break;
        case "gift":
            yield (0, gift_1.execute)(interaction);
            break;
        case "top":
            yield (0, top_1.execute)(interaction);
            break;
        case "work":
            yield (0, work_1.execute)(interaction);
            break;
        default:
            throw new Error("Subcommand not found");
    }
});
exports.execute = execute;

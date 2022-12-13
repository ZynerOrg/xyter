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
const view_1 = require("./modules/view");
//
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("counters")
    .setDescription("View guild counters")
    .setDMPermission(false)
    // Modules
    .addSubcommand(view_1.builder);
// Execute function
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    switch (interaction.options.getSubcommand()) {
        case "view":
            yield (0, view_1.execute)(interaction);
            break;
        default:
            throw new Error("No module found for that command.");
    }
});
exports.execute = execute;

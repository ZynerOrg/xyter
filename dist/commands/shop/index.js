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
const cpgg_1 = __importDefault(require("./modules/cpgg"));
const roles_1 = __importDefault(require("./modules/roles"));
// Function
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("shop")
    .setDescription("Shop for credits and custom roles.")
    .setDMPermission(false)
    // Modules
    .addSubcommand(cpgg_1.default.builder)
    .addSubcommandGroup(roles_1.default.builder);
// Execute the command
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { options } = interaction;
    switch (options.getSubcommand()) {
        case "cpgg": {
            yield cpgg_1.default.execute(interaction);
            break;
        }
        default: {
            throw new Error("Could not find module for that command.");
        }
    }
    switch (options.getSubcommandGroup()) {
        case "roles": {
            yield roles_1.default.execute(interaction);
            break;
        }
        default: {
            throw new Error("Could not find module for that command.");
        }
    }
});
exports.execute = execute;

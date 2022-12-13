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
const audits_1 = __importDefault(require("./modules/audits"));
const cpgg_1 = __importDefault(require("./modules/cpgg"));
const credits_1 = __importDefault(require("./modules/credits"));
const embeds_1 = __importDefault(require("./modules/embeds"));
const points_1 = __importDefault(require("./modules/points"));
const shop_1 = __importDefault(require("./modules/shop"));
const welcome_1 = __importDefault(require("./modules/welcome"));
exports.builder = new discord_js_1.SlashCommandBuilder()
    .setName("config")
    .setDescription("Manage guild configurations.")
    .setDMPermission(false)
    // Modules
    .addSubcommand(audits_1.default.builder)
    .addSubcommand(cpgg_1.default.builder)
    .addSubcommand(credits_1.default.builder)
    .addSubcommand(embeds_1.default.builder)
    .addSubcommand(points_1.default.builder)
    .addSubcommand(shop_1.default.builder)
    .addSubcommand(welcome_1.default.builder);
// Execute function
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    switch (interaction.options.getSubcommand()) {
        case "audits":
            yield audits_1.default.execute(interaction);
            break;
        case "cpgg":
            yield cpgg_1.default.execute(interaction);
            break;
        case "credits":
            yield credits_1.default.execute(interaction);
            break;
        case "embeds":
            yield embeds_1.default.execute(interaction);
            break;
        case "points":
            yield points_1.default.execute(interaction);
            break;
        case "shop":
            yield shop_1.default.execute(interaction);
            break;
        case "welcome":
            yield welcome_1.default.execute(interaction);
            break;
        default:
            throw new Error("No module found for that specific command.");
    }
});
exports.execute = execute;

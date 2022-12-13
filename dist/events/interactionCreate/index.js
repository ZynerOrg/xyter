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
// 3rd party dependencies
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Dependencies
const audits_1 = __importDefault(require("./audits"));
const handlers_1 = require("./handlers");
exports.options = {
    type: "on",
};
// Execute the event
const execute = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, id } = interaction;
    logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`New interaction: ${id} in guild: ${guild === null || guild === void 0 ? void 0 : guild.name} (${guild === null || guild === void 0 ? void 0 : guild.id})`);
    switch (interaction.type) {
        case discord_js_1.InteractionType.ApplicationCommand:
            yield (0, handlers_1.handleCommandInteraction)(interaction);
            break;
        default:
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Unknown interaction type: ${interaction.type}`);
    }
    yield audits_1.default.execute(interaction);
});
exports.execute = execute;

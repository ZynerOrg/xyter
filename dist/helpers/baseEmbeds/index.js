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
exports.error = exports.wait = exports.success = void 0;
const discord_js_1 = require("discord.js");
const getEmbedData_1 = __importDefault(require("../getEmbedData"));
// Construct a base embed for success messages
const success = (guild, title) => __awaiter(void 0, void 0, void 0, function* () {
    const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
    return new discord_js_1.EmbedBuilder()
        .setTimestamp(new Date())
        .setTitle(title)
        .setColor(successColor)
        .setFooter({ text: footerText, iconURL: footerIcon });
});
exports.success = success;
// Construct a base embed for wait messages
const wait = (guild, title) => __awaiter(void 0, void 0, void 0, function* () {
    const { waitColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
    return new discord_js_1.EmbedBuilder()
        .setTimestamp(new Date())
        .setTitle(title)
        .setColor(waitColor)
        .setFooter({ text: footerText, iconURL: footerIcon });
});
exports.wait = wait;
// Construct a base embed for error messages
const error = (guild, title) => __awaiter(void 0, void 0, void 0, function* () {
    const { errorColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(guild);
    return new discord_js_1.EmbedBuilder()
        .setTimestamp(new Date())
        .setTitle(title)
        .setColor(errorColor)
        .setFooter({ text: footerText, iconURL: footerIcon });
});
exports.error = error;

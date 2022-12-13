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
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../../../middlewares/logger"));
exports.default = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { options, guild } = interaction;
    if (!guild)
        throw new Error("Guild not found");
    const embedConfig = yield (0, getEmbedData_1.default)(guild);
    if (!embedConfig)
        throw new Error("Embed config not found");
    const newSuccessColor = options.getString("success-color");
    const newWaitColor = options.getString("wait-color");
    const newErrorColor = options.getString("error-color");
    const newFooterIcon = options.getString("footer-icon");
    const newFooterText = options.getString("footer-text");
    if (!newSuccessColor)
        throw new Error("Success color not found");
    if (!newWaitColor)
        throw new Error("Wait color not found");
    if (!newErrorColor)
        throw new Error("Error color not found");
    if (!newFooterIcon)
        throw new Error("Footer icon not found");
    if (!newFooterText)
        throw new Error("Footer text not found");
    const createGuild = yield database_1.default.guild.upsert({
        where: {
            id: guild.id,
        },
        update: {
            embedColorSuccess: newSuccessColor,
            embedColorWait: newWaitColor,
            embedColorError: newErrorColor,
            embedFooterIcon: newFooterIcon,
            embedFooterText: newFooterText,
        },
        create: {
            id: guild.id,
            embedColorSuccess: newSuccessColor,
            embedColorWait: newWaitColor,
            embedColorError: newErrorColor,
            embedFooterIcon: newFooterIcon,
            embedFooterText: newFooterText,
        },
    });
    logger_1.default.silly(createGuild);
    const successColor = createGuild.embedColorSuccess;
    const waitColor = createGuild.embedColorWait;
    const errorColor = createGuild.embedColorError;
    const footerText = createGuild.embedFooterText;
    const footerIcon = createGuild.embedFooterIcon;
    return { successColor, waitColor, errorColor, footerText, footerIcon };
});

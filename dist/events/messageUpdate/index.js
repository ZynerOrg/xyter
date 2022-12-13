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
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Modules
const counter_1 = __importDefault(require("./modules/counter"));
const audits_1 = __importDefault(require("./audits"));
exports.options = {
    type: "on",
};
// Execute the function
const execute = (oldMessage, newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const { author, guild } = newMessage;
    yield audits_1.default.execute(oldMessage, newMessage);
    logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Message update event fired by ${author.tag} (${author.id}) in guild: ${guild === null || guild === void 0 ? void 0 : guild.name} (${guild === null || guild === void 0 ? void 0 : guild.id})`);
    if (author === null || author === void 0 ? void 0 : author.bot)
        return logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Message update event fired by bot`);
    yield (0, counter_1.default)(newMessage);
    return true;
});
exports.execute = execute;

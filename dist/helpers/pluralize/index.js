"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.default = (count, noun, suffix) => {
    const result = `${count} ${noun}${count !== 1 ? suffix || "s" : ""}`;
    logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Pluralized ${count} to ${result}`);
    return result;
};

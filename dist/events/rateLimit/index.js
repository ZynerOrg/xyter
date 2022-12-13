"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.options = void 0;
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.options = {
    type: "on",
};
// Function to execute the event
const execute = (client) => {
    var _a;
    logger_1.default.warn(`Discord's API client (${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}) is rate-limited!`);
};
exports.execute = execute;

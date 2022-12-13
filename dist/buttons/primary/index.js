"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.metadata = void 0;
const logger_1 = __importDefault(require("../../middlewares/logger"));
exports.metadata = { guildOnly: false, ephemeral: false };
// Execute the function
const execute = (interaction) => {
    logger_1.default.debug(interaction.customId, "primary button clicked!");
};
exports.execute = execute;

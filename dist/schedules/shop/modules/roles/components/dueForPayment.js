"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const logger_1 = __importDefault(require("../../../../../middlewares/logger"));
// Execute the dueForPayment function
const execute = (_client, role) => {
    const { roleId } = role;
    logger_1.default.silly(`Shop role ${roleId} is not due for payment.`);
};
exports.execute = execute;

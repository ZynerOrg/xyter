"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const { combine, timestamp, printf, errors, colorize, align, json } = winston_1.default.format;
exports.default = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports: [
        new winston_1.default.transports.DailyRotateFile({
            filename: "logs/combined-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d",
            format: combine(timestamp(), json()),
        }),
        new winston_1.default.transports.Console({
            format: combine(errors({ stack: true, trace: true }), // <-- use errors format
            colorize({ all: true }), timestamp({
                format: "YYYY-MM-DD HH:MM:ss",
            }), align(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
        }),
    ],
});

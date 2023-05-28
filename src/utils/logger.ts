import winston from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, json, errors, colorize, align, printf } =
  winston.format;

const logFormat = printf((info) => {
  const formattedMessage = info.stack || info.message;
  return `[${info.timestamp}] ${info.level}: ${formattedMessage}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: "logs/combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: combine(
        errors({ stack: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        json()
      ),
    }),
    new winston.transports.Console({
      format: combine(
        errors({ stack: true, trace: true }),
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        logFormat
      ),
    }),
  ],
});

export default logger;

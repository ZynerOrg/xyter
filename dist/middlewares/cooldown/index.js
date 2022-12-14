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
const date_fns_1 = require("date-fns");
const database_1 = __importDefault(require("../../handlers/database"));
const logger_1 = __importDefault(require("../logger"));
exports.default = (guild, user, id, cooldown, silent) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user has a timeout
    const isOnCooldown = yield database_1.default.cooldown.findUnique({
        where: {
            guildId_userId_timeoutId: {
                guildId: guild.id,
                userId: user.id,
                timeoutId: id,
            },
        },
    });
    logger_1.default.silly(isOnCooldown);
    if (isOnCooldown) {
        const { userId, timeoutId, createdAt } = isOnCooldown;
        const dueDate = (0, date_fns_1.add)(createdAt, { seconds: cooldown });
        const duration = (0, date_fns_1.formatDuration)((0, date_fns_1.intervalToDuration)({
            start: new Date(),
            end: dueDate,
        }));
        if ((0, date_fns_1.isPast)(dueDate)) {
            return yield database_1.default.cooldown.delete({
                where: {
                    guildId_userId_timeoutId: {
                        guildId: guild.id,
                        userId: user.id,
                        timeoutId: id,
                    },
                },
            });
        }
        if (silent) {
            return logger_1.default.verbose(`User ${userId} is on cooldown for ${timeoutId}, it ends in ${duration}.`);
        }
        throw new Error(`You need to wait for ${duration} before you can do that again`);
    }
    const createCooldown = yield database_1.default.cooldown.upsert({
        where: {
            guildId_userId_timeoutId: {
                userId: user.id,
                guildId: guild.id,
                timeoutId: id,
            },
        },
        update: {},
        create: {
            guild: {
                connectOrCreate: {
                    create: {
                        id: guild.id,
                    },
                    where: {
                        id: guild.id,
                    },
                },
            },
            user: {
                connectOrCreate: {
                    create: {
                        id: user.id,
                    },
                    where: {
                        id: user.id,
                    },
                },
            },
            timeoutId: id,
            cooldown,
        },
    });
    logger_1.default.silly(createCooldown);
    return createCooldown;
});

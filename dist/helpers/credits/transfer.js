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
const database_1 = __importDefault(require("../../handlers/database"));
const transactionRules_1 = __importDefault(require("./transactionRules"));
exports.default = (guild, from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Decrement amount from the sender.
        const sender = yield tx.guildMember.upsert({
            update: {
                creditsEarned: {
                    decrement: amount,
                },
            },
            create: {
                user: {
                    connectOrCreate: {
                        create: {
                            id: from.id,
                        },
                        where: {
                            id: from.id,
                        },
                    },
                },
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
                creditsEarned: -amount,
            },
            where: {
                userId_guildId: {
                    userId: from.id,
                    guildId: guild.id,
                },
            },
        });
        // 4. Verify that the sender's balance didn't go below zero.
        if (sender.creditsEarned < 0) {
            throw new Error(`${from} doesn't have enough to send ${amount}`);
        }
        // 5. Check if the transactions is valid.
        (0, transactionRules_1.default)(guild, from, amount);
        (0, transactionRules_1.default)(guild, to, amount);
        // 6. Verify that sender and recipient are not the same user.
        if (from.id === to.id)
            throw new Error("You can't transfer to yourself.");
        // 7. Increment the recipient's balance by amount.
        const recipient = yield tx.guildMember.upsert({
            update: {
                creditsEarned: {
                    increment: amount,
                },
            },
            create: {
                user: {
                    connectOrCreate: {
                        create: {
                            id: to.id,
                        },
                        where: {
                            id: to.id,
                        },
                    },
                },
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
                creditsEarned: amount,
            },
            where: {
                userId_guildId: {
                    userId: to.id,
                    guildId: guild.id,
                },
            },
        });
        return recipient;
    }));
});

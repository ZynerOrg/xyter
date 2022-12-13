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
exports.default = (guild, user, amount) => __awaiter(void 0, void 0, void 0, function* () {
    return yield database_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Check if the transaction is valid.
        (0, transactionRules_1.default)(guild, user, amount);
        // 2. Make the transaction.
        const recipient = yield tx.guildMember.upsert({
            update: {
                creditsEarned: {
                    decrement: amount,
                },
            },
            create: {
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
                    userId: user.id,
                    guildId: guild.id,
                },
            },
        });
        // 3. Verify that the recipient credits are not below zero.
        if (recipient.creditsEarned < -100)
            throw new Error("User do not have enough credits");
        // 4. Return the recipient.
        return recipient;
    }));
});

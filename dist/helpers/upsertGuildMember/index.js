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
exports.default = (guildMember) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild, user } = guildMember;
    return yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId: user.id,
                guildId: guild.id,
            },
        },
        update: {},
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
        },
    });
});

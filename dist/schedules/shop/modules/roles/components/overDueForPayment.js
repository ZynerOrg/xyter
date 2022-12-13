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
exports.execute = void 0;
const logger_1 = __importDefault(require("../../../../../middlewares/logger"));
const database_1 = __importDefault(require("../../../../../handlers/database"));
// Execute the component
const execute = (client, role) => __awaiter(void 0, void 0, void 0, function* () {
    const { guildId, userId, roleId } = role;
    if (!userId)
        throw new Error("User ID not found for shop role.");
    const rGuild = client.guilds.cache.get(guildId);
    if (!rGuild)
        throw new Error("Guild not found.");
    const rMember = yield rGuild.members.fetch(userId);
    if (!rMember)
        throw new Error("Member not found.");
    const rRole = rMember.roles.cache.get(roleId);
    if (!rRole)
        throw new Error("Role not found.");
    logger_1.default.debug(`Shop role ${roleId} is due for payment.`);
    const getGuildMember = yield database_1.default.guildMember.findUnique({
        where: {
            userId_guildId: {
                userId,
                guildId,
            },
        },
        include: {
            user: true,
            guild: true,
        },
    });
    logger_1.default.silly(getGuildMember);
    if (!getGuildMember)
        throw new Error("Could not find guild member.");
    const pricePerHour = getGuildMember.guild.shopRolesPricePerHour;
    if (getGuildMember.creditsEarned < pricePerHour) {
        yield rMember.roles
            .remove(roleId)
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            const deleteShopRole = yield database_1.default.guildShopRoles.delete({
                where: {
                    guildId_userId_roleId: {
                        guildId,
                        userId,
                        roleId,
                    },
                },
            });
            logger_1.default.silly(deleteShopRole);
            logger_1.default.silly(`Shop role document ${roleId} has been deleted from user ${userId}.`);
        }))
            .catch(() => {
            throw new Error(`Failed removing role from user.`);
        });
        throw new Error("User does not have enough credits.");
    }
    const createGuildMember = yield database_1.default.guildMember.upsert({
        where: {
            userId_guildId: {
                userId,
                guildId,
            },
        },
        update: { creditsEarned: { decrement: pricePerHour } },
        create: {
            creditsEarned: -pricePerHour,
            user: {
                connectOrCreate: {
                    create: {
                        id: userId,
                    },
                    where: {
                        id: userId,
                    },
                },
            },
            guild: {
                connectOrCreate: {
                    create: {
                        id: guildId,
                    },
                    where: {
                        id: guildId,
                    },
                },
            },
        },
        include: {
            user: true,
            guild: true,
        },
    });
    logger_1.default.silly(createGuildMember);
    logger_1.default.silly(`User ${userId} has been updated.`);
    const updateGuildShopRole = yield database_1.default.guildShopRoles.update({
        where: {
            guildId_userId_roleId: {
                guildId,
                userId,
                roleId,
            },
        },
        data: {
            lastPayed: new Date(),
        },
    });
    logger_1.default.silly(updateGuildShopRole);
    logger_1.default.silly(`Shop role ${roleId} has been updated.`);
    logger_1.default.debug(`Shop role ${roleId} has been paid.`);
});
exports.execute = execute;

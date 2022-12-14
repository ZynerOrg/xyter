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
// Dependencies
// Helpers
const discord_js_1 = require("discord.js");
// Configurations
// Models
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const logger_1 = __importDefault(require("../../../../../../middlewares/logger"));
// Configurations
// Models
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
const pluralize_1 = __importDefault(require("../../../../../../helpers/pluralize"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("cancel")
            .setDescription("Cancel a purchase.")
            .addRoleOption((option) => option
            .setName("role")
            .setDescription("Role you wish to cancel.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield (0, deferReply_1.default)(interaction, true);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild, user, member } = interaction;
        const optionRole = options.getRole("role");
        if (optionRole === null)
            throw new Error("We could not read your requested role.");
        if (!guild)
            throw new Error("No guild specified");
        if (!user)
            throw new Error("No user specified");
        const roleExist = yield database_1.default.guildShopRoles.findUnique({
            where: {
                guildId_userId_roleId: {
                    guildId: guild.id,
                    userId: user.id,
                    roleId: optionRole.id,
                },
            },
        });
        if (roleExist === null)
            return;
        yield ((_a = member === null || member === void 0 ? void 0 : member.roles) === null || _a === void 0 ? void 0 : _a.remove(optionRole === null || optionRole === void 0 ? void 0 : optionRole.id));
        yield (guild === null || guild === void 0 ? void 0 : guild.roles.delete(optionRole === null || optionRole === void 0 ? void 0 : optionRole.id, `${user === null || user === void 0 ? void 0 : user.id} canceled from shop`).then(() => __awaiter(void 0, void 0, void 0, function* () {
            const createGuildMember = yield database_1.default.guildMember.upsert({
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
                include: {
                    user: true,
                    guild: true,
                },
            });
            logger_1.default.silly(createGuildMember);
            if (!createGuildMember)
                throw new Error("Guild member not created");
            const deleteShopRole = yield database_1.default.guildShopRoles.delete({
                where: {
                    guildId_userId_roleId: {
                        guildId: guild === null || guild === void 0 ? void 0 : guild.id,
                        userId: user === null || user === void 0 ? void 0 : user.id,
                        roleId: optionRole === null || optionRole === void 0 ? void 0 : optionRole.id,
                    },
                },
            });
            logger_1.default.silly(deleteShopRole);
            const interactionEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("[:shopping_cart:] Cancel")
                .setDescription(`You have canceled ${optionRole.name}.`)
                .setTimestamp()
                .setColor(successColor)
                .addFields({
                name: "Your balance",
                value: `${(0, pluralize_1.default)(createGuildMember.creditsEarned, "credit")}`,
            })
                .setFooter({ text: footerText, iconURL: footerIcon });
            return interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                embeds: [interactionEmbed],
            });
        })));
    }),
};

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
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../../../middlewares/logger"));
// Configurations
// import fetchUser from "../../../../../../helpers/userData";
// Models
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const pluralize_1 = __importDefault(require("../../../../../../helpers/pluralize"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("buy")
            .setDescription("Buy a custom role.")
            .addStringOption((option) => option
            .setName("name")
            .setDescription("Name of the role you wish to buy.")
            .setRequired(true))
            .addStringOption((option) => option
            .setName("color")
            .setDescription("Color of the role you wish to buy.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild, user, member } = interaction;
        const optionName = options === null || options === void 0 ? void 0 : options.getString("name");
        const optionColor = options === null || options === void 0 ? void 0 : options.getString("color");
        // If amount is null
        if (optionName === null)
            throw new Error("We could not read your requested name");
        yield (guild === null || guild === void 0 ? void 0 : guild.roles.create({
            name: optionName,
            color: optionColor,
            reason: `${user === null || user === void 0 ? void 0 : user.id} bought from shop`,
        }).then((role) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const userId = "SNOWFLKAE";
            const guildId = "SNOWFLAKE";
            const createGuildMember = yield database_1.default.guildMember.upsert({
                where: {
                    userId_guildId: {
                        userId,
                        guildId,
                    },
                },
                update: {},
                create: {
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
            // Get guild object
            const pricePerHour = createGuildMember.guild.shopRolesPricePerHour;
            const updateGuildMember = yield database_1.default.guildMember.update({
                where: {
                    userId_guildId: {
                        userId,
                        guildId,
                    },
                },
                data: {
                    creditsEarned: { decrement: pricePerHour },
                },
            });
            logger_1.default.silly(updateGuildMember);
            const createShopRole = yield database_1.default.guildShopRoles.upsert({
                where: {
                    guildId_userId_roleId: {
                        guildId: guild.id,
                        userId: user.id,
                        roleId: role.id,
                    },
                },
                update: {},
                create: {
                    roleId: role.id,
                    lastPayed: new Date(),
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
            logger_1.default.silly(createShopRole);
            yield ((_a = member === null || member === void 0 ? void 0 : member.roles) === null || _a === void 0 ? void 0 : _a.add(role === null || role === void 0 ? void 0 : role.id));
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Role ${role === null || role === void 0 ? void 0 : role.name} was bought by ${user === null || user === void 0 ? void 0 : user.tag}`);
            const interactionEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("[:shopping_cart:] Buy")
                .setDescription(`You bought **${optionName}** for **${(0, pluralize_1.default)(pricePerHour, "credit")}**.`)
                .setTimestamp()
                .setColor(successColor)
                .setFooter({ text: footerText, iconURL: footerIcon });
            return interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                embeds: [interactionEmbed],
            });
        })).catch(() => {
            throw new Error("Failed creating role.");
        }));
    }),
};

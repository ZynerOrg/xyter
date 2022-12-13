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
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const encryption_1 = __importDefault(require("../../../../helpers/encryption"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../middlewares/logger"));
exports.default = {
    builder: (command) => {
        return command
            .setName("cpgg")
            .setDescription("Buy cpgg power.")
            .addIntegerOption((option) => option
            .setName("amount")
            .setDescription("How much credits you want to withdraw.")
            .setRequired(true));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        yield (0, deferReply_1.default)(interaction, true);
        const { errorColor, successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild, user, client } = interaction;
        const optionAmount = options === null || options === void 0 ? void 0 : options.getInteger("amount");
        if (optionAmount === null) {
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Amount is null.`);
            const interactionEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("[:dollar:] Gift")
                .setDescription("We could not read your requested amount.")
                .setTimestamp()
                .setColor(errorColor)
                .setFooter({ text: footerText, iconURL: footerIcon });
            return interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                embeds: [interactionEmbed],
            });
        }
        if (!guild)
            throw new Error("Guild not found");
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
        const dmUser = (_b = (_a = client === null || client === void 0 ? void 0 : client.users) === null || _a === void 0 ? void 0 : _a.cache) === null || _b === void 0 ? void 0 : _b.get(user === null || user === void 0 ? void 0 : user.id);
        if ((optionAmount || createGuildMember.creditsEarned) < 100)
            throw new Error("You can't withdraw to CPGG below 100 credits.");
        if ((optionAmount || createGuildMember.creditsEarned) > 1000000)
            throw new Error("Amount or user credits is above 1.000.000.");
        if (createGuildMember.creditsEarned < optionAmount)
            throw new Error("You can't withdraw more than you have on your account.");
        if (!createGuildMember.guild.apiCpggUrlIv ||
            !createGuildMember.guild.apiCpggUrlContent)
            throw new Error("No API url available");
        if (!createGuildMember.guild.apiCpggTokenIv ||
            !createGuildMember.guild.apiCpggTokenContent)
            throw new Error("No API token available");
        const code = (0, uuid_1.v4)();
        const url = encryption_1.default.decrypt({
            iv: createGuildMember.guild.apiCpggUrlIv,
            content: createGuildMember.guild.apiCpggUrlContent,
        });
        const api = axios_1.default === null || axios_1.default === void 0 ? void 0 : axios_1.default.create({
            baseURL: `${url}/api/`,
            headers: {
                Authorization: `Bearer ${encryption_1.default.decrypt({
                    iv: createGuildMember.guild.apiCpggTokenIv,
                    content: createGuildMember.guild.apiCpggTokenContent,
                })}`,
            },
        });
        const shopUrl = `${url}/store`;
        const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Redeem it here")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setEmoji("🏦")
            .setURL(`${shopUrl}?voucher=${code}`));
        yield ((_d = api === null || api === void 0 ? void 0 : api.post("vouchers", {
            uses: 1,
            code,
            credits: optionAmount || createGuildMember.creditsEarned,
            memo: `${interaction === null || interaction === void 0 ? void 0 : interaction.createdTimestamp} - ${(_c = interaction === null || interaction === void 0 ? void 0 : interaction.user) === null || _c === void 0 ? void 0 : _c.id}`,
        })) === null || _d === void 0 ? void 0 : _d.then(() => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.silly(`Successfully created voucher.`);
            createGuildMember.creditsEarned -=
                optionAmount || createGuildMember.creditsEarned;
            const updateGuildMember = yield database_1.default.guildMember.update({
                where: {
                    userId_guildId: {
                        userId: user.id,
                        guildId: guild.id,
                    },
                },
                data: {
                    creditsEarned: {
                        decrement: optionAmount || createGuildMember.creditsEarned,
                    },
                },
            });
            logger_1.default.silly(updateGuildMember);
            if (!interaction.guild)
                throw new Error("Guild is undefined");
            const dmEmbed = new discord_js_1.EmbedBuilder()
                .setTitle("[:shopping_cart:] CPGG")
                .setDescription(`This voucher comes from **${interaction.guild.name}**.`)
                .setTimestamp()
                .addFields({
                name: "💶 Credits",
                value: `${optionAmount || createGuildMember.creditsEarned}`,
                inline: true,
            })
                .setColor(successColor)
                .setFooter({ text: footerText, iconURL: footerIcon });
            yield (dmUser === null || dmUser === void 0 ? void 0 : dmUser.send({
                embeds: [dmEmbed],
                components: [buttons],
            }).then((msg) => __awaiter(void 0, void 0, void 0, function* () {
                const interactionEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle("[:shopping_cart:] CPGG")
                    .setDescription(`I have sent you the code in [DM](${msg.url})!`)
                    .setTimestamp()
                    .setColor(successColor)
                    .setFooter({ text: footerText, iconURL: footerIcon });
                yield (interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                    embeds: [interactionEmbed],
                }));
            })));
        })));
        return true;
    }),
};

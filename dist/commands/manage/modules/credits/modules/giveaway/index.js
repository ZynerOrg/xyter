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
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const encryption_1 = __importDefault(require("../../../../../../helpers/encryption"));
// Configurations
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../../../middlewares/logger"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("giveaway")
            .setDescription("Giveaway some credits for specified amount of users.")
            .addIntegerOption((option) => option
            .setName("uses")
            .setDescription("How many users should be able to use this.")
            .setRequired(true))
            .addIntegerOption((option) => option
            .setName("credit")
            .setDescription(`How much credits provided per use.`)
            .setRequired(true))
            .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The channel to send the message to.")
            .setRequired(true)
            .addChannelTypes(discord_js_1.ChannelType.GuildText));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild); // Destructure
        const { guild, user, options } = interaction;
        const uses = options === null || options === void 0 ? void 0 : options.getInteger("uses");
        const creditAmount = options === null || options === void 0 ? void 0 : options.getInteger("credit");
        const channel = options === null || options === void 0 ? void 0 : options.getChannel("channel");
        if (!uses)
            throw new Error("Amount of uses is required.");
        if (!creditAmount)
            throw new Error("Amount of credits is required.");
        if (!channel)
            throw new Error("Channel is required.");
        if (!guild)
            throw new Error("Guild is required.");
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("[:toolbox:] Giveaway")
            .setFooter({ text: footerText, iconURL: footerIcon });
        const code = (0, uuid_1.v4)();
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
        if (!createGuildMember.guild.apiCpggUrlIv ||
            !createGuildMember.guild.apiCpggUrlContent)
            throw new Error("No API url available");
        if (!createGuildMember.guild.apiCpggTokenIv ||
            !createGuildMember.guild.apiCpggTokenContent)
            throw new Error("No API token available");
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
        yield api
            .post("vouchers", {
            uses,
            code,
            credits: creditAmount,
            memo: `[GIVEAWAY] ${interaction === null || interaction === void 0 ? void 0 : interaction.createdTimestamp} - ${(_a = interaction === null || interaction === void 0 ? void 0 : interaction.user) === null || _a === void 0 ? void 0 : _a.id}`,
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                embeds: [
                    embed
                        .setColor(successColor)
                        .setDescription(`Successfully created code: ${code}`),
                ],
            });
            const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setLabel("Redeem it here")
                .setStyle(discord_js_1.ButtonStyle.Link)
                .setEmoji("🏦")
                .setURL(`${shopUrl}?voucher=${code}`));
            const discordChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(channel.id);
            if (!discordChannel)
                return;
            if (discordChannel.type !== discord_js_1.ChannelType.GuildText)
                return;
            discordChannel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("[:parachute:] Credits!")
                        .addFields([
                        {
                            name: "💶 Credits",
                            value: `${creditAmount}`,
                            inline: true,
                        },
                    ])
                        .setDescription(`${interaction.user} dropped a voucher for a maximum **${uses}** members!`)
                        .setColor(successColor),
                ],
                components: [buttons],
            });
        }));
    }),
};

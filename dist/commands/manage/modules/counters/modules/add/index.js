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
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
// Configurations
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
const logger_1 = __importDefault(require("../../../../../../middlewares/logger"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("add")
            .setDescription("Add a counter to your guild.")
            .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The channel to send the counter to.")
            .setRequired(true)
            .addChannelTypes(discord_js_1.ChannelType.GuildText))
            .addStringOption((option) => option
            .setName("word")
            .setDescription("The word to use for the counter.")
            .setRequired(true))
            .addNumberOption((option) => option
            .setName("start")
            .setDescription("The starting value of the counter."));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild } = interaction;
        const discordChannel = options === null || options === void 0 ? void 0 : options.getChannel("channel");
        const triggerWord = options === null || options === void 0 ? void 0 : options.getString("word");
        const startValue = options === null || options === void 0 ? void 0 : options.getNumber("start");
        if (!guild)
            throw new Error("We could not find a guild");
        if (!discordChannel)
            throw new Error("We could not find a channel");
        if (!triggerWord)
            throw new Error("We could not find a word");
        const channelCounter = yield database_1.default.guildCounter.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild.id,
                    channelId: discordChannel.id,
                },
            },
        });
        if (channelCounter)
            throw new Error("A counter already exists for this channel.");
        const createGuildCounter = yield database_1.default.guildCounter.upsert({
            where: {
                guildId_channelId: {
                    guildId: guild.id,
                    channelId: discordChannel.id,
                },
            },
            update: {},
            create: {
                channelId: discordChannel.id,
                triggerWord,
                count: startValue || 0,
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
        logger_1.default.silly(createGuildCounter);
        if (createGuildCounter) {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle("[:toolbox:] Counters - Add")
                .setTimestamp(new Date())
                .setFooter({ text: footerText, iconURL: footerIcon });
            yield (interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
                embeds: [
                    embed
                        .setDescription(":white_check_mark: Counter created successfully.")
                        .setColor(successColor),
                ],
            }));
        }
    }),
};

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
// Models
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../../../handlers/deferReply"));
const checkPermission_1 = __importDefault(require("../../../../../../helpers/checkPermission"));
// Configurations
const database_1 = __importDefault(require("../../../../../../handlers/database"));
const getEmbedData_1 = __importDefault(require("../../../../../../helpers/getEmbedData"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("remove")
            .setDescription(`Delete a counter from your guild.`)
            .addChannelOption((option) => option
            .setName("channel")
            .setDescription("The channel to delete the counter from.")
            .setRequired(true)
            .addChannelTypes(discord_js_1.ChannelType.GuildText));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, true);
        (0, checkPermission_1.default)(interaction, discord_js_1.PermissionsBitField.Flags.ManageGuild);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const { options, guild } = interaction;
        const discordChannel = options === null || options === void 0 ? void 0 : options.getChannel("channel");
        if (!guild)
            throw new Error("We could not find a guild");
        if (!discordChannel)
            throw new Error("We could not find a channel");
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("[:toolbox:] Counters - Remove")
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon });
        const channelCounter = yield database_1.default.guildCounter.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guild.id,
                    channelId: discordChannel.id,
                },
            },
        });
        if (!channelCounter)
            throw new Error("There is no counter sin this channel, please add one first.");
        const deleteGuildCounter = yield database_1.default.guildCounter.deleteMany({
            where: {
                guildId: guild.id,
                channelId: discordChannel.id,
            },
        });
        if (!deleteGuildCounter)
            throw new Error("We could not find a counter for this guild");
        yield (interaction === null || interaction === void 0 ? void 0 : interaction.editReply({
            embeds: [
                embed
                    .setDescription(":white_check_mark: Counter deleted successfully.")
                    .setColor(successColor),
            ],
        }));
    }),
};

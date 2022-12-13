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
/* eslint-disable no-loops/no-loops */
// Dependencies
const date_fns_1 = require("date-fns");
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
// Configurations
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
// Function
exports.default = {
    builder: (command) => {
        return command
            .setName("about")
            .setDescription("Check information about this instance");
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, false);
        if (!interaction.guild)
            throw new Error("You need to be in a guild");
        const { client } = interaction;
        // await cooldown(
        //   interaction.guild,
        //   interaction.user,
        //   interaction.commandId,
        //   3600
        // );
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        // // Initialize a storage for the user ids
        // const userIds = new Set();
        // // Iterate over all guilds (always cached)
        // for await (const guild of client.guilds.cache.values()) {
        //   // Fetch all guild members and iterate over them
        //   for await (const member of (await guild.members.fetch()).values()) {
        //     // Fetch the user, if user already cached, returns value from cache
        //     // Will probably always return from cache
        //     const user = await client.users.fetch(member.id);
        //     // Check if user id is not already in set and user is not a bot
        //     if (!userIds.has(user.id) && !user.bot) {
        //       // Add unique user id to our set
        //       userIds.add(user.id);
        //     }
        //   }
        // }
        const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setLabel("Support")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setEmoji("💬")
            .setURL("https://discord.zyner.org"), new discord_js_1.ButtonBuilder()
            .setLabel("Documentation")
            .setStyle(discord_js_1.ButtonStyle.Link)
            .setEmoji("📚")
            .setURL("https://xyter.zyner.org"));
        const interactionEmbed = new discord_js_1.EmbedBuilder()
            .setColor(successColor)
            .setTitle(":toolbox:︱About this instance")
            .setDescription(`This bot instance is hosted by [${process.env.BOT_HOSTER_NAME}](${process.env.BOT_HOSTER_URL}) who might have modified the [source code](https://github.com/ZynerOrg/xyter).`)
            .setFields({
            name: "Latency",
            value: `${Math.round(client.ws.ping)} ms`,
            inline: true,
        }, {
            name: "Servers (cached)",
            value: `${client.guilds.cache.size}`,
            inline: true,
        }, {
            name: "Users (cached)",
            value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`,
            inline: true,
        }, {
            name: "Version",
            value: `[${process.env.npm_package_version}](https://github.com/ZynerOrg/xyter/releases/tag/${process.env.npm_package_version})`,
            inline: true,
        }, {
            name: "Since last restart",
            value: `${(0, date_fns_1.formatDuration)((0, date_fns_1.intervalToDuration)({
                start: (0, date_fns_1.subMilliseconds)(new Date(), client.uptime),
                end: new Date(),
            }))}`,
            inline: true,
        })
            .setTimestamp()
            .setFooter({ text: footerText, iconURL: footerIcon });
        yield interaction.editReply({
            embeds: [interactionEmbed],
            components: [buttons],
        });
    }),
};

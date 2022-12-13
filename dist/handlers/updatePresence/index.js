"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Dependencies
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../../middlewares/logger"));
// Function
exports.default = (client) => {
    // 1. Destructure the client.
    const { guilds, user } = client;
    if (!user)
        throw new Error("No user found");
    // 2. Get the total number of guilds and members.
    const memberCount = guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const guildCount = guilds.cache.size;
    // 3. Set the presence.
    user.setPresence({
        activities: [
            {
                name: `${guildCount} guilds | ${memberCount} members`,
                type: discord_js_1.ActivityType.Watching,
            },
        ],
    });
    // 4. Log the presence.
    return logger_1.default.info(`👀 Presence set to "${guildCount} guilds | ${memberCount} members"`);
};

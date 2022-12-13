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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js"); // discord.js
require("dotenv/config");
const command_1 = require("./handlers/command");
const event_1 = require("./handlers/event");
const schedule_1 = require("./handlers/schedule");
// Main process that starts all other sub processes
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Initiate client object
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMembers,
            discord_js_1.GatewayIntentBits.GuildMessages,
            discord_js_1.GatewayIntentBits.MessageContent,
        ],
    });
    // Create command collection
    client.commands = new discord_js_1.Collection();
    // Start critical handlers
    yield (0, schedule_1.start)(client);
    yield (0, event_1.register)(client);
    yield (0, command_1.register)(client);
    // Authorize with Discord's API
    yield client.login(process.env.DISCORD_TOKEN);
});
// Start main process
main();

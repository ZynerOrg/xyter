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
const discord_js_1 = require("discord.js");
const deferReply_1 = __importDefault(require("../../../../handlers/deferReply"));
const getEmbedData_1 = __importDefault(require("../../../../helpers/getEmbedData"));
exports.default = {
    builder: (command) => {
        return command
            .setName("avatar")
            .setDescription("Check someones avatar!)")
            .addUserOption((option) => option
            .setName("user")
            .setDescription("The user whose avatar you want to check"));
    },
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, deferReply_1.default)(interaction, false);
        const { successColor, footerText, footerIcon } = yield (0, getEmbedData_1.default)(interaction.guild);
        const userOption = interaction.options.getUser("user");
        const targetUser = userOption || interaction.user;
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(":toolbox:︱Avatar")
            .setTimestamp(new Date())
            .setFooter({ text: footerText, iconURL: footerIcon });
        const avatarUrl = targetUser.displayAvatarURL();
        return interaction.editReply({
            embeds: [
                embed
                    .setDescription(userOption
                    ? `You can also [download it here](${avatarUrl})!`
                    : `Your avatar is available to [download here](${avatarUrl}).`)
                    .setThumbnail(avatarUrl)
                    .setColor(successColor),
            ],
        });
    }),
};
